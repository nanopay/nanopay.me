import { retrieveApiKey } from '@/services/api-key'
import { AdminClient } from '@/services/client'
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

		const { service_id } = await retrieveApiKey(apiToken)

		const client = new AdminClient()

		const service = await client.services.get(service_id)

		return Response.json(service)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return Response.json({ message }, { status: 500 })
	}
}
