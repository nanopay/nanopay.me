import { supabase } from '@/lib/supabase'
import { createApiKey } from '@/utils/apiKey'
import Ajv, { Schema } from 'ajv'
import { NextRequest } from 'next/server'

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

	const { error: authError } = await supabase.authWithCookies(req.cookies)

	if (authError) {
		return Response.json({ message: authError.message }, { status: 401 })
	}

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id, user_id, api_keys_count')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		return Response.json({ message: serviceError.message }, { status: 500 })
	}

	if (service.api_keys_count >= LIMIT_API_KEYS) {
		return Response.json(
			{
				message: `Limit of ${LIMIT_API_KEYS} API keys reached`,
			},
			{
				status: 403,
			},
		)
	}

	const { apiKey, checksum } = createApiKey()

	const write = await supabase.from('api_keys').insert({
		service_id: service.id,
		name: body.name,
		description: body.description,
		checksum,
		scopes: ['*'],
	})

	if (write.error) {
		return Response.json({ message: write.error.message }, { status: 500 })
	}

	return Response.json({ apiKey })
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
	const { error: authError } = await supabase.authWithCookies(req.cookies)

	if (authError) {
		return Response.json({ message: authError.message }, { status: 401 })
	}

	const { data, error } = await supabase
		.from('api_keys')
		.select('*')
		.eq('name', serviceName)
		.single()

	if (error) {
		return Response.json({ message: error.message }, { status: 500 })
	}

	return Response.json(data)
}
