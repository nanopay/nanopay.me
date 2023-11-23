import * as nanocurrency from 'nanocurrency'
import Ajv, { JSONSchemaType } from 'ajv'
import { checksumFromApiKey, verifyApiKey } from '@/utils/apiKey'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_EXPIRATION, INVOICE_MINIMUM_PRICE } from '@/constants'
import paymentWorker from '@/services/paymentWorker'
import { generateInvoiceId } from '@/utils/invoice'
import addFormats from 'ajv-formats'
import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

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

export async function POST(
	req: NextRequest,
	{
		params: { serviceName },
	}: {
		params: {
			serviceName: string
		}
	},
) {
	const body = await req.json()

	const valid = ajv.validate(schema, body)

	if (!valid) {
		return Response.json({ message: ajv.errorsText() }, { status: 400 })
	}

	const supabase = createClient(cookies())

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError) {
		return Response.json({ message: authError.message }, { status: 401 })
	}

	if (nanocurrency.checkSeed(HOT_WALLET_SEED) === false) {
		return Response.json(
			{ message: 'Invalid hot wallet seed' },
			{
				status: 500,
			},
		)
	}

	const expires_at = new Date(Date.now() + INVOICE_EXPIRATION).toISOString()
	const title = body.title
	const description = body.description
	const metadata = body.metadata
	const price = body.price
	const currency = 'XNO'
	const recipient_address = body.recipient_address
	const redirect_url = body.redirect_url

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
			service: serviceName,
			user_id: serviceName ? null : user?.id,
			redirect_url,
		})
		.select('index')
		.single()

	if (error) {
		Response.json({ message: error.message }, { status: 500 })
	}

	// Use invoice ID as index to derive a unique deposit address
	const index = invoice!!.index
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
		return Response.json({ message: updateError.message }, { status: 500 })
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

	return Response.json({
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

export async function GET(
	req: NextRequest,
	{
		params: { serviceName },
	}: {
		params: {
			serviceName: string
		}
	},
) {
	const supabase = createClient(cookies())

	const { data: invoices, error: invoicesError } = await supabase
		.from('invoices')
		.select('*, service:services(name)')
		.eq('service.name', serviceName)

	if (invoicesError) {
		return Response.json({ message: invoicesError.message }, { status: 500 })
	}

	return Response.json(invoices)
}
