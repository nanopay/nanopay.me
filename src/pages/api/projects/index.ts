import { supabase } from '@/lib/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
import Ajv from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

const ajv = new Ajv({ allErrors: true, formats: fullFormats })

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
		description: { type: 'string', maxLength: 512 },
	},
	required: ['name', 'avatar_url'],
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	if (!ajv.validate(schema, req.body)) {
		return res.status(400).json({ message: ajv.errorsText() })
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

	const { error, data } = await supabase.from('projects').insert({
		...req.body,
		id: user.id,
	})

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	console.log('data', data)

	res.status(200).json({ name: 'John Doe' })
}
