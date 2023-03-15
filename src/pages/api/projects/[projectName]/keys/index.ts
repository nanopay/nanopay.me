import { getBytes, hexlify, isHexString } from '@/utils/helpers'
import { blake2bHex } from 'blakejs'
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import crypto from 'crypto'
import Ajv, { Schema } from 'ajv'

const ajv = new Ajv()

const schema: Schema = {
	type: 'object',
	properties: {
		project: { type: 'string' },
		name: { type: 'string', minLength: 1, maxLength: 40 },
		description: { type: 'string', maxLength: 512 },
	},
	required: ['project', 'name'],
	additionalProperties: false,
}

const API_KEY_BYTES_LENGTH = 16
const API_KEY_CHECKSUM_BYTES_LENGTH = 4
const API_KEYS_SECRET = process.env.API_KEYS_SECRET
const LIMIT_API_KEYS = 5

const getKeys = async (req: NextApiRequest, res: NextApiResponse) => {
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
		.from('api_keys')
		.select('*')

	if (error) {
		return res.status(500).json({ message: error.message })
	}

	res.status(200).json(data)
}

const newKey = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ajv.validate(schema, req.body)) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

	const projectName = req.query.projectName as string

	if (!projectName) {
		return res.status(400).json({ message: 'Missing project name' })
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

	if (
		!API_KEYS_SECRET ||
		!isHexString(API_KEYS_SECRET) ||
		API_KEYS_SECRET.length != 64
	) {
		return res.status(500).json({
			message: 'API_KEYS_SECRET is not set or is not a valid hex string',
		})
	}

	const { data: project, error: projectError } = await supabase
		.from('projects')
		.select('id, user_id, api_keys_count')
		.eq('name', projectName)
		.single()

	if (projectError) {
		return res.status(500).json({ message: projectError.message })
	}

	if (!project) {
		return res.status(404).json({ message: 'Project not found' })
	}

	if (project.user_id !== user.id) {
		return res.status(403).json({ message: 'Forbidden' })
	}

	if (project.api_keys_count >= LIMIT_API_KEYS) {
		return res.status(403).json({
			message: `Limit of ${LIMIT_API_KEYS} API keys reached`,
		})
	}

	const randomBytes = crypto.getRandomValues(
		new Uint8Array(API_KEY_BYTES_LENGTH),
	)

	const secretKeyBytes = getBytes(API_KEYS_SECRET)

	const checksum = blake2bHex(
		randomBytes,
		secretKeyBytes,
		API_KEY_CHECKSUM_BYTES_LENGTH,
	)

	const apiKey = hexlify(randomBytes) + checksum

	const write = await supabase.from('api_keys').insert({
		project_id: project.id,
		name: req.body.name,
		description: req.body.description,
		checksum,
		user_id: user.id,
		scopes: ['*'],
	})

	if (write.error) {
		return res.status(500).json({ message: write.error.message })
	}

	return res.status(200).json({ apiKey })
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		return getKeys(req, res)
	} else if (req.method === 'POST') {
		return newKey(req, res)
	} else {
		return res.status(405).json({ message: 'Method Not Allowed' })
	}
}
