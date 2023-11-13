import { supabase } from '@/lib/supabase'
import Ajv from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import s3 from '@/services/s3'
import { randomUUID } from 'crypto'
import { concatURL } from '@/utils/helpers'
import { NextRequest } from 'next/server'

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

export async function GET(req: NextRequest) {
	const { error: authError } = await supabase.authWithCookies(req.cookies)

	if (authError) {
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401,
			},
		)
	}

	const { data, error } = await supabase
		.from('services')
		.select('id, name, avatar_url, description')

	if (error) {
		return Response.json(
			{ message: error.message },
			{
				status: 500,
			},
		)
	}

	return Response.json(data)
}

export async function POST(req: NextRequest) {
	const body = await req.json()

	if (!ajv.validate(schema, req.body)) {
		return Response.json(
			{ message: ajv.errorsText() },
			{
				status: 400,
			},
		)
	}

	const { data, error: authError } = await supabase.authWithCookies(req.cookies)

	if (authError || !data?.user) {
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401,
			},
		)
	}

	const serviceId = randomUUID()

	let avatarUrl = body.avatar_url
	if (avatarUrl) {
		const avatarHost = new URL(avatarUrl).host
		const avatarPath = new URL(avatarUrl).pathname

		if (avatarHost !== process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST) {
			return Response.json(
				{ message: 'avatar_url host not allowed' },
				{ status: 400 },
			)
		}

		if (!avatarPath.startsWith('/tmp/')) {
			return Response.json(
				{ message: 'avatar_url path not allowed' },
				{ status: 400 },
			)
		}

		if (!avatarPath.endsWith('.png')) {
			return Response.json(
				{ message: 'avatar_url extension not allowed' },
				{ status: 400 },
			)
		}

		const avatarNewPath = `/services/${serviceId}/avatar.png`

		try {
			await s3.moveObject(avatarPath, avatarNewPath)
		} catch (error) {
			return Response.json(
				{ message: 'Could not load avatar' },
				{ status: 500 },
			)
		}

		avatarUrl = concatURL(
			'https://' + process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST,
			avatarNewPath,
		)
	}

	const { error } = await supabase.from('services').insert({
		...req.body,
		id: serviceId,
		user_id: data.user.id,
		display_name: body.name,
		avatar_url: avatarUrl,
	})

	if (error) {
		return Response.json({ message: error.message }, { status: 500 })
	}

	return Response.json({ id: serviceId })
}
