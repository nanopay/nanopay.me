import { MAX_IMAGE_SIZE, STATIC_ASSETS_URL } from '@/core/constants'
import { Client } from '@/core/client'
import { putObject } from '@/services/s3'
import { ServerRuntime } from 'next'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const runtime: ServerRuntime = 'edge'

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ serviceIdOrSlug: string }> },
) {
	const params = await props.params

	const { serviceIdOrSlug } = params

	try {
		const formData = await req.formData()
		const file = formData.get('file') as File

		if (!file) {
			return Response.json(
				{
					message: 'No file received',
				},
				{
					status: 400,
				},
			)
		}

		if (file.type !== 'image/png') {
			return Response.json(
				{
					message: 'Invalid image type',
				},
				{
					status: 400,
				},
			)
		}

		if (file.size > MAX_IMAGE_SIZE) {
			return Response.json(
				{
					message: 'Image too large',
				},
				{
					status: 400,
				},
			)
		}

		const client = new Client(await cookies())

		const userId = await client.user.getUserId()

		const service = await client.services.get(serviceIdOrSlug)

		if (!service) {
			return Response.json(
				{
					message: 'Service not found',
				},
				{
					status: 404,
				},
			)
		}

		if (userId !== service.user_id) {
			return Response.json(
				{
					message: 'Unauthorized',
				},
				{
					status: 401,
				},
			)
		}

		const key = `services/${service.id}/avatar.png`

		await putObject(key, file, file.type)

		const url = new URL(STATIC_ASSETS_URL)
		url.pathname = key
		url.searchParams.append('v', Date.now().toString())

		await client.services.update(service.id, { avatar_url: url.toString() })

		revalidateTag(`service-${service.id}`)
		revalidateTag(`service-${serviceIdOrSlug}`)
		revalidateTag(`user-${userId}-services`)

		return Response.json(
			{ url: url.toString() },
			{
				status: 201,
			},
		)
	} catch (error) {
		console.error(error)
		return Response.json({ message: 'Error uploading' }, { status: 500 })
	}
}
