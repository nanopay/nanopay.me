import { HookUpdate } from '@/types/hooks'
import { createClient } from '@/utils/supabase/server'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

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

export async function GET(
	req: NextRequest,
	{
		params: { hookId },
	}: {
		params: {
			hookId: string
		}
	},
) {
	const supabase = createClient(cookies())

	const { error: hookError, data: hook } = await supabase
		.from('hooks')
		.select('*')
		.eq('id', hookId)
		.single()

	if (hookError) {
		if (hookError.code === 'PGRST116') {
			return Response.json({ message: 'forbidden' }, { status: 403 })
		}
		return Response.json({ message: hookError.message }, { status: 500 })
	}

	return Response.json(hook)
}

export async function PUT(
	req: NextRequest,
	{
		params: { hookId },
	}: {
		params: {
			hookId: string
		}
	},
) {
	const body = await req.json()

	if (!ajv.validate(schema, body)) {
		return Response.json({ message: ajv.errorsText() }, { status: 400 })
	}

	const supabase = createClient(cookies())

	const { error: updateError } = await supabase
		.from('hooks')
		.update(body)
		.eq('id', hookId)
		.single()

	if (updateError) {
		if (updateError.code === 'PGRST116') {
			return Response.json({ message: 'nothing updated' }, { status: 403 })
		}
		return Response.json({ message: updateError.message }, { status: 500 })
	}

	return Response.json({ message: 'success' })
}
