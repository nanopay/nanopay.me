import { supabase } from '@/lib/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function getInvoice(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET')
		return res.status(405).json({ message: 'Method not allowed' })
	}

	const { invoiceId } = req.query

	const { data: payments, error } = await supabase
		.from('payments')
		.select('id, from, to, hash, amount, timestamp')
		.eq('invoice_id', invoiceId)

	if (error) {
		console.log('error', error)
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json(payments)
}
