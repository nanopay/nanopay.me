import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getInvoice(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET')
		return res.status(405).json({ message: 'Method not allowed' })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	const {
		data: { user },
		error: userError,
	} = await supabaseServerClient.auth.getUser()

	if (userError && userError.status !== 401) {
		console.log('userError', userError)
		return res.status(500).json({ message: userError.message })
	}

	const { invoiceId } = req.query

	const { data: invoice, error } = await supabase
		.from('invoices')
		.select(
			'*, projects(name, display_name, avatar_url, description, id, website, contact_email)',
		)
		.eq('id', invoiceId)
		.single()

	if (error) {
		console.log('error', error)
		return res.status(500).json({ message: error.message })
	}

	if (!invoice) {
		return res.status(404).json({ message: 'Invoice not found' })
	}

	const isOwner = invoice.user_id === user?.id

	res.status(200).json({
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
		project: invoice.projects,
		...(isOwner && {
			metadata: invoice.metadata,
			recipient_address: invoice.recipient_address,
		}),
	})
}
