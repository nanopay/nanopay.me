import { MAX_HOOKS } from '@/constants'
import { supabase } from '@/lib/supabase'
import { HookCreate } from '@/types/hooks'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { NextApiRequest, NextApiResponse } from 'next'

const ajv = new Ajv()
addFormats(ajv)

const schema: JSONSchemaType<HookCreate> = {
	type: 'object',
	properties: {
		name: {
			type: 'string',
			minLength: 2,
			maxLength: 24,
			pattern: '^[a-zA-Z0-9-.]+$',
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		url: {
			type: 'string',
			format: 'uri',
			maxLength: 512,
		},
		event_types: {
			type: 'array',
			items: {
				type: 'string',
				enum: ['invoice.paid', 'invoice.error', 'invoice.expired'],
			},
			minItems: 1,
		},
		secret: {
			type: 'string',
			minLength: 8,
			maxLength: 256,
			nullable: true,
		},
	},
	required: ['name', 'url', 'event_types'],
	additionalProperties: false,
}

const createHook = async (req: NextApiRequest, res: NextApiResponse) => {
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

	const { data: service, error: serviceError } = await supabaseServerClient
		.from('services')
		.select('id, user_id, hooks_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return res.status(500).json({ message: serviceError.message })
	}

	if (!service) {
		return res.status(404).json({ message: 'Service not found' })
	}

	if (service.hooks_count >= MAX_HOOKS) {
		return res.status(403).json({
			message: `Limit of ${MAX_HOOKS} hooks reached`,
		})
	}

	const headers = {
		'Content-Type': 'application/json',
	}

	const { error: hookError, data: hook } = await supabase
		.from('hooks')
		.insert([
			{
				...req.body,
				service_id: service.id,
				method: 'POST',
				headers,
			},
		])
		.select('id')

	if (hookError) {
		return res.status(500).json({ message: hookError.message })
	}

	return res.status(200).json(hook)
}

const getHooks = async (req: NextApiRequest, res: NextApiResponse) => {
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

	const { data: service, error: serviceError } = await supabaseServerClient
		.from('services')
		.select('id, user_id, hooks_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return res.status(500).json({ message: serviceError.message })
	}

	if (!service) {
		return res.status(404).json({ message: 'Service not found' })
	}

	const { data: hooks, error: hooksError } = await supabaseServerClient
		.from('hooks')
		.select('*')
		.eq('service_id', service.id)

	if (hooksError) {
		return res.status(500).json({ message: hooksError.message })
	}

	return res.status(200).json(hooks)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'POST':
			return createHook(req, res)
		case 'GET':
			return getHooks(req, res)
		default:
			return res.status(405).json({ message: 'Method not allowed' })
	}
}
