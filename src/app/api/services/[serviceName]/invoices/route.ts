import Ajv, { JSONSchemaType } from 'ajv'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_MINIMUM_PRICE } from '@/constants'
import paymentGateway from '@/services/payment-gateway'
import addFormats from 'ajv-formats'
import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

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
		title,
		description,
		metadata,
		price,
		recipient_address,
		redirect_url,
	} = body

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return Response.json({ message: serviceError.message }, { status: 500 })
	}

	try {
		const { id, pay_address, expires_at } =
			await paymentGateway.invoices.create({
				service_id: service.id,
				title,
				description,
				metadata,
				price,
				recipient_address,
				redirect_url,
			})

		return Response.json({
			id,
			expires_at,
			title,
			pay_currency: 'XNO',
			pay_address,
			pay_amount: price,
			pay_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${id}`,
			// TODO: Implement invoices limit / remaining / reset
			invoices_limit: 100,
			invoices_remaining: 99,
			invoices_limit_reset_at: expires_at,
		})
	} catch (error: any) {
		console.error(
			'Payment Worker Error:',
			paymentGateway.getErrorMessage(error),
		)
		return Response.json(
			{
				message:
					'Failed to queue payment worker: ' +
					paymentGateway.getErrorMessage(error),
			},
			{ status: 500 },
		)
	}
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
