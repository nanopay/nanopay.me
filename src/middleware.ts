import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSupabaseSessionForMiddleware } from '@/lib/supabase/supabase-middleware'
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

const PUBLIC_ROUTES = [
	'/',
	'/invoices/:id',
	'/invoices/:id/receipt',
	'/demo',
	...AUTH_ROUTES,
]

const routeMatch = (routes: string[], target: string): boolean => {
	return routes.some(route => pathToRegexp(route).regexp.test(target))
}

export async function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone()
	const pathname = nextUrl.pathname

	// Rewrite API url (like api.nanopay.me) to /api
	const host = request.headers.get('host')
	const isAPIRoute = process.env.CUSTOM_API_DOMAIN === host
	if (isAPIRoute) {
		nextUrl.pathname = `/api${pathname}`
		return NextResponse.rewrite(nextUrl)
	}

	const isPublicRoute = routeMatch(PUBLIC_ROUTES, pathname)
	const isAuthRoute = routeMatch(AUTH_ROUTES, pathname)
	const isRootPath = pathname === '/'

	const { isAuthenticated, supabaseResponse } =
		await updateSupabaseSessionForMiddleware(request)

	if (isAuthenticated && (isAuthRoute || isRootPath)) {
		// Redirect to the last service
		const lastServiceSlug = await getLastServiceSlug()
		nextUrl.pathname = lastServiceSlug ? `/${lastServiceSlug}` : '/services/new'
		return NextResponse.redirect(nextUrl)
	}

	if (!isAuthenticated && !isPublicRoute) {
		nextUrl.searchParams.set(`next`, pathname)
		nextUrl.pathname = '/login'
		return NextResponse.redirect(nextUrl)
	}

	return supabaseResponse
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - Any file with an extension (e.g. .ico .js, .css, .png)
		 */
		{
			source: '/((?!api|static|.*\\..*|_next).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}

async function getLastServiceSlug(): Promise<string | null> {
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

		return services[0]?.slug || null
	} catch (error) {
		console.error('Error getting last service:', error)
		return null
	}
}
