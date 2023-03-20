import { NextApiRequest, NextApiResponse } from 'next'
import * as nanocurrency from 'nanocurrency'
import Ajv from 'ajv'
import { supabase } from '@/lib/supabase'
import { API_KEY_CHECKSUM_BYTES_LENGTH, verifyApiKey } from '@/utils/apiKey'
import { catchMiddleware } from '@/utils/catchMiddleware'

const INVOICE_EXPIRATION = 1000 * 60 * 15 // 15 minutes
const HOT_WALLET_SEED = process.env.HOT_WALLET_SEED || ''
const INVOICE_MINIMUM_PRICE = 0.0001

const ajv = new Ajv()

const schema = {
	type: 'object',
	properties: {
		currency: { type: 'string', enum: ['XNO'] },
		price: { type: 'number', minimum: INVOICE_MINIMUM_PRICE },
		recipient_address: { type: 'string' },
	},
	required: ['price', 'recipient_address'],
	additionalProperties: false,
}

export default catchMiddleware(async function (
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		return res.status(405).json({ message: 'Method Not Allowed' })
	}

	const valid = ajv.validate(schema, req.body)

	if (!valid) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

	const authorization = req.headers.authorization || ''

	if (!authorization) {
		return res.status(400).json({ message: 'Missing authorization header' })
	}

	const apiKey = authorization.split('Bearer ')[1]

	if (!apiKey) {
		return res.status(400).json({ message: 'Missing bearer apiKey' })
	}

	if (!verifyApiKey(apiKey)) {
		return res.status(401).json({ message: 'Invalid apiKey' })
	}

	const checksum = apiKey.slice(-API_KEY_CHECKSUM_BYTES_LENGTH * 2)

	const { data: apiKeyData, error: apiKeyError } = await supabase
		.from('api_keys')
		.select('*')
		.eq('checksum', checksum)
		.single()

	if (apiKeyError) {
		return res.status(500).json({ message: apiKeyError.message })
	}

	if (!apiKeyData) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (nanocurrency.checkSeed(HOT_WALLET_SEED) === false) {
		return res.status(500).json({ message: 'Invalid hot wallet seed' })
	}

	const expires_at = new Date(Date.now() + INVOICE_EXPIRATION).toISOString()
	const price = req.body.price
	const currency = req.body.currency || 'XNO'
	const recipient_address = req.body.recipient_address

	const { data: invoice, error } = await supabase
		.from('invoices')
		.insert({
			expires_at,
			currency,
			price,
			recipient_address,
			project_id: apiKeyData.project_id,
			user_id: apiKeyData.user_id,
		})
		.select('id')
		.single()

	if (error || !invoice) {
		return res.status(500).json({ message: error.message })
	}

	// Use invoice ID as index to derive a unique deposit address
	const index = invoice.id
	const secretKey = nanocurrency.deriveSecretKey(HOT_WALLET_SEED, index)
	const publicKey = nanocurrency.derivePublicKey(secretKey)
	const pay_address = nanocurrency.deriveAddress(publicKey, {
		useNanoPrefix: true,
	})

	const { error: updateError } = await supabase
		.from('invoices')
		.update({
			pay_address,
		})
		.eq('id', invoice.id)

	if (updateError) {
		return res.status(500).json({ message: updateError.message })
	}

	res.status(200).json({
		invoice_id: invoice.id,
		expires_at,
		pay_currency: 'XNO',
		pay_address,
		pay_amount: price,
		pay_url: `${process.env.NEXT_PUBLIC_BASE_URL}/v1/invoices/${invoice.id}`,
		invoices_limit: 100,
		invoices_remaining: 99,
		invoices_limit_reset_at: expires_at,
	})
})
