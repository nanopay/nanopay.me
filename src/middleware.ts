import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'
import { applySetCookie } from '@/utils/cookies'
import { cookies } from 'next/headers'
import { Client } from './services/client'

const authRoutes = [
	'/login',
	'/signup',
	'/magic-link',
	'/verify-email',
	'/forgot-password',
	'/confirm-signup',
	'/auth/callback',
]

const publicRoutes = ['/invoices/:path*', ...authRoutes]

export async function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone()

	if (
		publicRoutes.includes(nextUrl.pathname) &&
		!authRoutes.includes(nextUrl.pathname)
	) {
		return NextResponse.next()
	}

	const { supabase, response } = createClient(request)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	applySetCookie(request, response)

	const isAuthenticated = !!session

	if (isAuthenticated) {
		if (authRoutes.includes(nextUrl.pathname) || nextUrl.pathname === '/') {
			// Redirect to the last service
			const lastService = await getLastService()
			nextUrl.pathname = lastService ? `/${lastService}` : '/services/new'
		} else {
			return response
		}
	} else if (nextUrl.pathname === '/') {
		return response
	} else {
		if (!publicRoutes.includes(nextUrl.pathname)) {
			nextUrl.searchParams.set(`next`, nextUrl.pathname)
			nextUrl.pathname = '/login'
		} else {
			return response
		}
	}

	return NextResponse.redirect(nextUrl)
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}

async function getLastService(): Promise<string | null> {
	try {
		const lastService = cookies().get('last_service')?.value

		if (lastService) {
			return lastService
		}

		const client = new Client(cookies())

		const services = await client.services.list({
			limit: 1,
			offset: 0,
			order: 'asc',
			order_by: 'name',
		})

		return services[0]?.name || null
	} catch (error) {
		console.error('Error getting last service:', error)
		return null
	}
}
