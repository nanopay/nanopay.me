import { MAX_HOOKS } from '@/constants'
import { HookCreate } from '@/types/hooks'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

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

export async function POST(
	req: NextRequest,
	{
		params: { serviceName },
	}: {
		params: {
			serviceName: string
		}
	},
) {
	const body = await req.json()

	if (!ajv.validate(schema, body)) {
		return Response.json({ message: ajv.errorsText() }, { status: 400 })
	}

	const supabase = createClient(cookies())

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id, user_id, hooks_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return Response.json({ message: serviceError.message }, { status: 500 })
	}

	if (!service) {
		return Response.json({ message: 'Service not found' }, { status: 404 })
	}

	if (service.hooks_count >= MAX_HOOKS) {
		return Response.json(
			{
				message: `Limit of ${MAX_HOOKS} hooks reached`,
			},
			{ status: 403 },
		)
	}

	const headers = {
		'Content-Type': 'application/json',
	}

	const { error: hookError, data: hook } = await supabase
		.from('hooks')
		.insert([
			{
				...body,
				service_id: service.id,
				method: 'POST',
				headers,
			},
		])
		.select('id')

	if (hookError) {
		return Response.json({ message: hookError.message }, { status: 500 })
	}

	return Response.json(hook)
}

export async function GET(
	req: NextRequest,
	{
		params: { serviceName },
	}: {
		params: {
			serviceName: string
		}
	},
) {
	const supabase = createClient(cookies())

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id, user_id, hooks_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return Response.json({ message: serviceError.message }, { status: 500 })
	}

	if (!service) {
		return Response.json(
			{ message: 'Service not found' },
			{
				status: 404,
			},
		)
	}

	const { data: hooks, error: hooksError } = await supabase
		.from('hooks')
		.select('*')
		.eq('service_id', service.id)

	if (hooksError) {
		return Response.json(
			{ message: hooksError.message },
			{
				status: 500,
			},
		)
	}

	return Response.json(hooks)
}
