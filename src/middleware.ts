import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from './utils/supabase/middleware'
import { applySetCookie } from './utils/cookies'

export async function middleware(request: NextRequest) {
	const { supabase, response } = createClient(request)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	applySetCookie(request, response)

	const isAuthenticated = !!session

	let pathname = request.nextUrl.pathname

	if (isAuthenticated) {
		if (pathname === '/login') {
			pathname = '/home'
		} else {
			return response
		}
	} else {
		if (pathname === '/login') {
			return response
		}
		pathname = '/login'
	}

	const redirectUrl = request.nextUrl.clone()
	redirectUrl.pathname = pathname
	if (request.nextUrl.pathname !== '/logout') {
		redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
	}
	return NextResponse.redirect(redirectUrl)
}

export const config = {
	matcher: ['/services/:path*', '/home', '/logout', '/login', '/register'],
}
