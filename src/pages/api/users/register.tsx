import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Ajv, { JSONSchemaType } from 'ajv'
import { UserRegisterProps } from '@/services/api/users'

const ajv = new Ajv()

const schema: JSONSchemaType<UserRegisterProps> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
	},
	required: ['email', 'name', 'avatar_url'],
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ajv.validate(schema, req.body)) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})
	const {
		data: { user },
		error,
	} = await supabaseServerClient.auth.getUser()

	if (error) {
		console.error(error)
		return res.status(500).json({ message: error.message })
	}

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (user.user_metadata?.confirmed_registration) {
		return res
			.status(400)
			.json({ message: 'User already confirmed registration' })
	}

	// update user metadata
	const { error: updateError, data } = await supabase.auth.admin.updateUserById(
		user.id,
		{
			user_metadata: {
				...user.user_metadata,
				confirmed_registration: true,
				internal_profile: {
					email: req.body.email,
					name: req.body.name,
					avatar_url: req.body.avatar_url,
				},
			},
		},
	)
	if (updateError) {
		console.error(error)
		return res.status(500).json({ message: updateError.message })
	}

	await supabaseServerClient.auth.refreshSession()

	res.status(200).json({ data })
}
