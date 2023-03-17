import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export const catchMiddleware =
	(handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			await handler(req, res)
		} catch (error: any) {
			res.status(500).json({ message: error.message })
		}
	}
