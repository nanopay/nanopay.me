import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const getServices = async (req: NextApiRequest, res: NextApiResponse) => {
	const serviceName = req.query.serviceName as string

	if (!serviceName) {
		return res.status(400).json({ message: 'Missing service name' })
	}

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

	const { data, error } = await supabaseServerClient
		.from('services')
		.select('*')
		.eq('name', serviceName)
		.single()

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json(data)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET':
			return getServices(req, res)
		default:
			return res.status(405).json({ message: 'Method not allowed' })
	}
}
