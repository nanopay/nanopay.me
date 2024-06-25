import { SITE_URL } from '@/constants'
import { retrieveApiKey } from '@/services/api-key'
import { AdminClient } from '@/services/client'
import { NextRequest } from 'next/server'

export async function GET(
	req: NextRequest,
	{
		params: { invoiceId },
	}: {
		params: {
			invoiceId: string
		}
	},
) {
	try {
		const client = new AdminClient()

		const apiToken = req.headers.get('Authorization')?.split('Bearer ')[1]

		if (!apiToken) {
			return Response.json(
				{ message: 'Authorization header is required' },
				{ status: 401 },
			)
		}

		const { service_id } = await retrieveApiKey(apiToken)

		const invoice = await client.invoices.get(invoiceId, service_id)

		if (!invoice) {
			return Response.json({ message: 'invoice not found' }, { status: 404 })
		}

		return Response.json({
			id: invoice.id,
			created_at: invoice.created_at,
			expires_at: invoice.expires_at,
			title: invoice.title,
			description: invoice.description,
			currency: 'XNO',
			pay_address: invoice.pay_address,
			price: invoice.price,
			status: invoice.status,
			received_amount: invoice.received_amount,
			refunded_amount: invoice.refunded_amount,
			pay_url: `${SITE_URL}/invoices/${invoice.id}`,
			redirect_url: invoice.redirect_url,
			metadata: invoice.metadata,
			recipient_address: invoice.recipient_address,
			payments: invoice.payments,
		})
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return Response.json({ message }, { status: 500 })
	}
}
