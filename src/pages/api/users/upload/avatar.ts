import { createPresigned } from '@/services/s3'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
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

	const { url, fields } = await createPresigned({
		key: `users/${user.id}/tmp/avatar.png`,
		minLength: 1024, // 1KB
		maxLength: 1024 * 1024 * 5, // 5MB
	})

	return res.status(200).json({ url, fields })
}
