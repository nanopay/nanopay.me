import { Client } from '@/core/client'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
	try {
		const requestUrl = new URL(request.url)
		const code = requestUrl.searchParams.get('code')
		const next = requestUrl.searchParams.get('next')

		if (!code) {
			return Response.json(
				{
					error: 'code is missing',
				},
				{
					status: 400,
				},
			)
		}

		const client = new Client(cookies())
		await client.auth.exchangeCodeForSession(code)

		const redirectTo = new URL(requestUrl.origin)
		redirectTo.pathname = next || '/'

		return Response.redirect(redirectTo)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An error occurred'
		return Response.json(
			{
				status: 'error',
				message,
			},
			{
				status: 500,
			},
		)
	}
}
