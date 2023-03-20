import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getInvoice(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { invoiceId } = req.query

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

	const { data: invoice, error } = await supabaseServerClient
		.from('invoices')
		.select('*')
		.eq('id', invoiceId)
		.single()

	if (error) {
		console.log('error', error)
		return res.status(500).json({ message: error.message })
	}

	if (!invoice) {
		return res.status(404).json({ message: 'Invoice not found' })
	}

	res.status(200).json({
		invoice_id: invoice.id,
		created_at: invoice.created_at,
		expires_at: invoice.expires_at,
		currency: 'XNO',
		pay_address: invoice.pay_address,
		price: invoice.price,
		status: invoice.status,
		received_amount: invoice.received_amount,
		refunded_amount: invoice.refunded_amount,
		pay_url: `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoice.id}`,
	})
}
