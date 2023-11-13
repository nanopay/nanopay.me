import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Ajv, { Schema } from 'ajv'
import { createApiKey } from '@/utils/apiKey'

const ajv = new Ajv()

const schema: Schema = {
	type: 'object',
	properties: {
		service: { type: 'string' },
		name: { type: 'string', minLength: 1, maxLength: 40 },
		description: { type: 'string', maxLength: 512 },
	},
	required: ['service', 'name'],
	additionalProperties: false,
}

const LIMIT_API_KEYS = 5

const newKey = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ajv.validate(schema, req.body)) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

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

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id, user_id, api_keys_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return res.status(500).json({ message: serviceError.message })
	}

	if (!service) {
		return res.status(404).json({ message: 'Service not found' })
	}

	if (service.user_id !== user.id) {
		return res.status(403).json({ message: 'Forbidden' })
	}

	if (service.api_keys_count >= LIMIT_API_KEYS) {
		return res.status(403).json({
			message: `Limit of ${LIMIT_API_KEYS} API keys reached`,
		})
	}

	const { apiKey, checksum } = createApiKey()

	const write = await supabase.from('api_keys').insert({
		service_id: service.id,
		name: req.body.name,
		description: req.body.description,
		checksum,
		scopes: ['*'],
	})

	if (write.error) {
		return res.status(500).json({ message: write.error.message })
	}

	return res.status(200).json({ apiKey })
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		return newKey(req, res)
	} else {
		return res.status(405).json({ message: 'Method Not Allowed' })
	}
}
