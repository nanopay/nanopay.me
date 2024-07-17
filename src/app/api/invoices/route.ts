import { SITE_URL } from '@/core/constants'
import { NextRequest } from 'next/server'
import {
	invoiceCreateSchema,
	invoicePaginationSchema,
} from '@/core/client/invoices/invoices-schemas'

import { ServerRuntime } from 'next/types'
import { AdminClient, InvoicePagination } from '@/core/client'

export const runtime: ServerRuntime = 'edge'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const parse = invoiceCreateSchema.safeParse(body)

		if (!parse.success) {
			return Response.json({ message: parse.error.message }, { status: 400 })
		}

		const apiToken = req.headers.get('Authorization')?.split('Bearer ')[1]

		if (!apiToken) {
			return Response.json(
				{ message: 'Authorization header is required' },
				{ status: 401 },
			)
		}

		const client = new AdminClient()

		const { service_id } = await client.apiKeys.get(apiToken)

		const { id, pay_address, expires_at } = await client.invoices.create(
			service_id,
			{
				title: body.title,
				description: body.description,
				metadata: body.metadata,
				price: body.price,
				recipient_address: body.recipient_address,
				redirect_url: body.redirect_url,
			},
		)

		return Response.json({
			id,
			expires_at,
			title: body.title,
			pay_currency: 'XNO',
			pay_address,
			pay_amount: body.price,
			pay_url: `${SITE_URL}/invoices/${id}`,
			// TODO: Implement invoices limit / remaining / reset
			// invoices_limit: 100,
			// invoices_remaining: 99,
			// invoices_limit_reset_at: expires_at,
		})
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return Response.json({ message }, { status: 500 })
	}
}

export async function GET(
	req: NextRequest,
	{
		searchParams,
	}: {
		searchParams: InvoicePagination
	},
) {
	try {
		const pagination: InvoicePagination = {
			limit: searchParams.limit || 10,
			offset: searchParams.offset || 0,
			order: searchParams.order || 'desc',
			order_by: searchParams.order_by || 'created_at',
		}

		const parse = invoicePaginationSchema.safeParse(pagination)

		if (!parse.success) {
			return Response.json({ message: parse.error.message }, { status: 400 })
		}

		const apiToken = req.headers.get('Authorization')?.split('Bearer ')[1]

		if (!apiToken) {
			return Response.json(
				{ message: 'Authorization header is required' },
				{ status: 401 },
			)
		}

		const client = new AdminClient()

		const { service_id } = await client.apiKeys.get(apiToken)

		const invoices = await client.invoices.list(service_id, pagination)

		return Response.json(invoices)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return Response.json({ message }, { status: 500 })
	}
}
