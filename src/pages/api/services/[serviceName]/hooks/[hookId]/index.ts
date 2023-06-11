import { HookUpdate } from '@/types/hooks'
import { Database } from '@/types/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { NextApiRequest, NextApiResponse } from 'next'

const ajv = new Ajv()
addFormats(ajv)

const schema: JSONSchemaType<HookUpdate> = {
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

const getHook = async (req: NextApiRequest, res: NextApiResponse) => {
	const serviceName = req.query.serviceName as string
	const hookId = req.query.hookId as string

	if (!serviceName) {
		return res.status(400).json({ message: 'Missing service name' })
	}

	if (!hookId) {
		return res.status(400).json({ message: 'Missing hook id' })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	const { error: hookError, data: hook } = await supabaseServerClient
		.from('hooks')
		.select('*')
		.eq('id', hookId)
		.single()

	if (hookError) {
		if (hookError.code === 'PGRST116') {
			return res.status(404).json({ message: 'not found' })
		}
		return res.status(500).json({ message: hookError.message })
	}

	return res.status(200).json(hook)
}

const updateHook = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ajv.validate(schema, req.body)) {
		return res.status(400).json({ message: ajv.errorsText() })
	}

	const serviceName = req.query.serviceName as string
	const hookId = req.query.hookId as string

	if (!serviceName) {
		return res.status(400).json({ message: 'Missing service name' })
	}

	if (!hookId) {
		return res.status(400).json({ message: 'Missing hook id' })
	}

	const supabaseServerClient = createServerSupabaseClient<Database>({
		req,
		res,
	})

	const { error: updateError } = await supabaseServerClient
		.from('hooks')
		.update(req.body)
		.eq('id', hookId)
		.single()

	if (updateError) {
		if (updateError.code === 'PGRST116') {
			return res.status(404).json({ message: 'nothing updated' })
		}
		return res.status(500).json({ message: updateError.message })
	}

	return res.status(200).json({ message: 'success' })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET':
			return getHook(req, res)
		case 'PUT':
			return updateHook(req, res)
		default:
			return res.status(405).json({ message: 'Method not allowed' })
	}
}
