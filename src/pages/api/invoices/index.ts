import { NextApiRequest, NextApiResponse } from 'next'
import * as nanocurrency from 'nanocurrency'
import Ajv, { JSONSchemaType } from 'ajv'
import { cookieHasSbAuthToken, supabase } from '@/lib/supabase'
import { API_KEY_CHECKSUM_BYTES_LENGTH, verifyApiKey } from '@/utils/apiKey'
import { catchMiddleware } from '@/utils/catchMiddleware'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_EXPIRATION, INVOICE_MINIMUM_PRICE } from '@/constants'
import paymentWorker from '@/services/paymentWorker'
import { generateInvoiceId } from '@/utils/invoice'
import addFormats from 'ajv-formats'

const HOT_WALLET_SEED = process.env.HOT_WALLET_SEED || ''

const ajv = new Ajv()
addFormats(ajv)

const schema: JSONSchemaType<InvoiceCreate> = {
	type: 'object',
	properties: {
		title: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		price: { type: 'number', minimum: INVOICE_MINIMUM_PRICE },
		recipient_address: {
			type: 'string',
			pattern: '^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$',
		},
		metadata: { type: 'object', nullable: true },
		redirect_url: {
			type: 'string',
			format: 'uri',
			maxLength: 512,
			nullable: true,
		},
	},
	required: ['title', 'price', 'recipient_address'],
	additionalProperties: false,
}

const createInvoice = async (req: NextApiRequest, res: NextApiResponse) => {
	const valid = ajv.validate(schema, req.body)

	if (!valid) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

	let serviceId: string | null = null
	let userId: string

	if (cookieHasSbAuthToken(req.cookies)) {
		const supabaseServerClient = createServerSupabaseClient<Database>({
			req,
			res,
		})

		const {
			data: { user },
			error: userError,
		} = await supabaseServerClient.auth.getUser()

		if (userError) {
			return res.status(500).json({ message: userError.message })
		}

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		userId = user.id

		if (typeof req.query.service_id === 'string') {
			serviceId = req.query.service_id
		}
	} else {
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
			.select('*,service:services(user_id)')
			.eq('checksum', checksum)
			.single()

		if (apiKeyError) {
			return res.status(500).json({ message: apiKeyError.message })
		}

		if (!apiKeyData) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		userId = (apiKeyData.service as any).user_id

		if (typeof req.query.service_id === 'string') {
			serviceId = req.query.service_id
		}
	}

	if (nanocurrency.checkSeed(HOT_WALLET_SEED) === false) {
		return res.status(500).json({ message: 'Invalid hot wallet seed' })
	}

	const expires_at = new Date(Date.now() + INVOICE_EXPIRATION).toISOString()
	const title = req.body.title
	const description = req.body.description
	const metadata = req.body.metadata
	const price = req.body.price
	const currency = req.body.currency || 'XNO'
	const recipient_address = req.body.recipient_address
	const redirect_url = req.body.redirect_url

	const invoiceId = generateInvoiceId()

	const { data: invoice, error } = await supabase
		.from('invoices')
		.insert({
			id: invoiceId,
			title,
			description,
			metadata,
			expires_at,
			currency,
			price,
			recipient_address,
			service_id: serviceId,
			user_id: serviceId ? null : userId,
			redirect_url,
		})
		.select('index')
		.single()

	if (error || !invoice) {
		return res.status(500).json({ message: error.message })
	}

	// Use invoice ID as index to derive a unique deposit address
	const index = invoice.index
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
		.eq('id', invoiceId)

	if (updateError) {
		return res.status(500).json({ message: updateError.message })
	}
	try {
		// Ask Payment Worker to watch for payments
		await paymentWorker.queue.add({
			invoiceId: invoiceId,
		})
	} catch (error: any) {
		console.error('Payment Worker Error:', paymentWorker.getErrorMessage(error))
		throw new Error(
			'Failed to queue payment worker: ' + paymentWorker.getErrorMessage(error),
		)
	}

	res.status(200).json({
		id: invoiceId,
		expires_at,
		title,
		pay_currency: 'XNO',
		pay_address,
		pay_amount: price,
		pay_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoiceId}`,
		invoices_limit: 100,
		invoices_remaining: 99,
		invoices_limit_reset_at: expires_at,
	})
}

const listInvoices = async (req: NextApiRequest, res: NextApiResponse) => {
	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	let serviceId: string
	let userId: string

	if (supabaseServerClient) {
		// If the request is authenticated with a Supabase session cookie, then we can
		// use `supabase.auth.getUser()` to retrieve the user's details.
		const {
			data: { user },
			error: userError,
		} = await supabaseServerClient.auth.getUser()

		if (userError) {
			return res.status(500).json({ message: userError.message })
		}

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		userId = user.id

		serviceId = req.query.service_id as string

		if (!serviceId) {
			return res.status(400).json({ message: 'Missing service id' })
		}
	} else {
		// If the request is not authenticated with a Supabase session cookie, then
		// we'll need to use an API key to authenticate the request.
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
			.select('service_id')
			.eq('checksum', checksum)
			.single()

		if (apiKeyError) {
			return res.status(500).json({ message: apiKeyError.message })
		}

		if (!apiKeyData) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		serviceId = apiKeyData.service_id
	}

	const { data: invoices, error: invoicesError } = await supabase
		.from('invoices')
		.select('*')
		.eq('service_id', serviceId)

	if (invoicesError) {
		return res.status(500).json({ message: invoicesError.message })
	}

	res.status(200).json(invoices)
}

export default catchMiddleware(async function (
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === 'POST') {
		await createInvoice(req, res)
	} else if (req.method === 'GET') {
		await listInvoices(req, res)
	} else {
		res.setHeader('Allow', 'POST, GET')
		return res.status(405).json({ message: 'Method Not Allowed' })
	}
})
