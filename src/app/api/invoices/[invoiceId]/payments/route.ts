import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function getInvoice(
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

	const { data: payments, error } = await supabase
		.from('payments')
		.select('id, from, to, hash, amount, timestamp')
		.eq('invoice_id', invoiceId)

	if (error) {
		return Response.json({ message: error.message }, { status: 500 })
	}

	return Response.json(payments)
}
