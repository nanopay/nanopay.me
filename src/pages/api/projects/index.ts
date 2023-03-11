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

const getProjects = async (req: NextApiRequest, res: NextApiResponse) => {
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
		.from('projects')
		.select('id, name, avatar_url, description')

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json(data)
}

const postProject = async (req: NextApiRequest, res: NextApiResponse) => {
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

	const { error, data } = await supabase
		.from('projects')
		.insert({
			...req.body,
			user_id: user.id,
		})
		.select('id')

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json({ id: data[0].id })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		await postProject(req, res)
	} else if (req.method === 'GET') {
		await getProjects(req, res)
	} else {
		return res.status(405).json({ message: 'Method not allowed' })
	}
}
