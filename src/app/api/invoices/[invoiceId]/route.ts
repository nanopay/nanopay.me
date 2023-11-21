import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
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
	const supabase = createClient(cookies())

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (userError && userError.status !== 401) {
		console.log('userError', userError)
		return Response.json({ message: userError.message }, { status: 500 })
	}

	const { data: invoice, error } = await supabase
		.from('invoices')
		.select(
			'*, service:services(name, display_name, avatar_url, description, id, website, contact_email, user_id)',
		)
		.eq('id', invoiceId as string)
		.single()

	if (error) {
		console.log('error', error)
		return Response.json({ message: error.message }, { status: 500 })
	}

	if (!invoice) {
		return Response.json({ message: 'Invoice not found' }, { status: 404 })
	}

	const isOwner = invoice.service[0]?.user_id === user?.id

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
		pay_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoice.id}`,
		service: invoice.service,
		redirect_url: invoice.redirect_url,
		...(isOwner && {
			metadata: invoice.metadata,
			recipient_address: invoice.recipient_address,
		}),
	})
}
