import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { applySetCookie } from '@/utils/cookies'
import { cookies } from 'next/headers'
import { Client } from './core/client'
import { pathToRegexp } from 'path-to-regexp'

const AUTH_ROUTES = [
	'/login',
	'/signup',
	'/magic-link',
	'/verify-email',
	'/forgot-password',
	'/confirm-signup',
	'/auth/callback',
]

const PUBLIC_ROUTES = ['/invoices/:id', ...AUTH_ROUTES]

const routeMatch = (routes: string[], target: string): boolean => {
	return routes.some(route => pathToRegexp(route).test(target))
}

export async function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone()
	const pathname = nextUrl.pathname

	const isPublicRoute = routeMatch(PUBLIC_ROUTES, pathname)
	const isAuthRoute = routeMatch(AUTH_ROUTES, pathname)
	const isRootPath = pathname === '/'

	if (isPublicRoute && !isAuthRoute) {
		return NextResponse.next()
	}

	const { supabase, response } = createClient(request)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	applySetCookie(request, response)

	const isAuthenticated = !!session

	if (isAuthenticated) {
		if (isAuthRoute || isRootPath) {
			// Redirect to the last service
			const lastService = await getLastService()
			nextUrl.pathname = lastService ? `/${lastService}` : '/services/new'
		} else {
			return response
		}
	} else if (isRootPath) {
		return response
	} else {
		if (!isPublicRoute) {
			nextUrl.searchParams.set(`next`, pathname)
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
