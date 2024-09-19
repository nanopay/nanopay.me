import { AdminClient } from '@/core/client'
import { ServerRuntime } from 'next'
import { NextRequest } from 'next/server'

export const runtime: ServerRuntime = 'edge'

export async function GET(req: NextRequest) {
	try {
		const apiToken = req.headers.get('Authorization')?.split('Bearer ')[1]

		if (!apiToken) {
			return Response.json(
				{ message: 'Authorization header is required' },
				{ status: 401 },
			)
		}

		const client = new AdminClient()

		const { service_id } = await client.apiKeys.get(apiToken)

		const service = await client.services.get(service_id)

		if (!service) {
			return Response.json({ message: 'Service not found' }, { status: 404 })
		}

		return Response.json(service)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return Response.json({ message }, { status: 500 })
	}
}
