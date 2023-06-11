import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const getDeliveries = async (req: NextApiRequest, res: NextApiResponse) => {
	const hookId = req.query.hookId as string

	if (!hookId) {
		return res.status(400).json({ message: 'Missing hook id' })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	const { error: hookError, data: deliveries } = await supabaseServerClient
		.from('hook_deliveries')
		.select('*')
		.eq('hook_id', hookId)

	if (hookError) {
		return res.status(500).json({ message: hookError.message })
	}

	return res.status(200).json(deliveries)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET':
			return getDeliveries(req, res)
		default:
			return res.status(405).json({ message: 'Method not allowed' })
	}
}
