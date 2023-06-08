import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const getHook = async (req: NextApiRequest, res: NextApiResponse) => {
	const serviceName = req.query.serviceName as string
	const hookId = req.query.hookId as string

	if (!serviceName) {
		return res.status(400).json({ message: 'Missing service name' })
	}

	if (!hookId) {
		return res.status(400).json({ message: 'Missing hook id' })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	const { error: hookError, data: hook } = await supabaseServerClient
		.from('hooks')
		.select('*')
		.eq('id', hookId)
		.single()

	if (hookError) {
		if (hookError.code === 'PGRST116') {
			return res.status(404).json({ message: 'Hook not found' })
		}
		return res.status(500).json({ message: hookError.message })
	}

	return res.status(200).json(hook)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET':
			return getHook(req, res)
		default:
			return res.status(405).json({ message: 'Method not allowed' })
	}
}
