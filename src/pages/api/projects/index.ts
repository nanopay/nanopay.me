import { supabase } from '@/lib/supabase'
import { NextApiRequest, NextApiResponse } from 'next'
import Ajv from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import s3 from '@/services/s3'
import { randomUUID } from 'crypto'
import { concatURL } from '@/utils/helpers'

const ajv = new Ajv({ allErrors: true, formats: fullFormats })

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
		description: { type: 'string', maxLength: 512 },
	},
	required: ['name'],
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

	const projectId = randomUUID()

	let avatarUrl = req.body.avatar_url

	if (avatarUrl) {
		const avatarHost = new URL(avatarUrl).host
		const avatarPath = new URL(avatarUrl).pathname

		if (avatarHost !== process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST) {
			return res.status(400).json({ message: 'avatar_url host not allowed' })
		}

		if (!avatarPath.startsWith('/tmp/')) {
			return res.status(400).json({ message: 'avatar_url path not allowed' })
		}

		if (!avatarPath.endsWith('.png')) {
			return res
				.status(400)
				.json({ message: 'avatar_url extension not allowed' })
		}

		const avatarNewPath = `users/${user.id}/projects/${projectId}/avatar.png`

		try {
			await s3.moveObject(avatarPath, avatarNewPath)
		} catch (error) {
			return res.status(500).json({ message: 'Could not load avatar' })
		}

		avatarUrl = concatURL(
			'https://' + process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST,
			avatarNewPath,
		)
	}

	const { error } = await supabase.from('projects').insert({
		...req.body,
		id: projectId,
		user_id: user.id,
		display_name: req.body.name,
		avatar_url: avatarUrl,
	})

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json({ id: projectId })
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
