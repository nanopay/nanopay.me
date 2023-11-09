import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()

	// Create authenticated Supabase Client.
	const supabase = createMiddlewareClient({ req, res })

	// Check if we have a session
	const {
		data: { session },
	} = await supabase.auth.getSession()

	let pathname = '/login'

	const role = session?.user?.role
	const confirmedRegistration =
		session?.user?.user_metadata?.confirmed_registration

	if (role === 'authenticated') {
		if (req.nextUrl.pathname !== '/register' && !confirmedRegistration) {
			pathname = '/register'
		} else if (req.nextUrl.pathname === '/register' && confirmedRegistration) {
			pathname = '/home'
		} else {
			return res
		}
	}

	// Auth condition not met, redirect to login or register page.
	const redirectUrl = req.nextUrl.clone()
	redirectUrl.pathname = pathname
	if (req.nextUrl.pathname !== '/logout') {
		redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
	}
	return NextResponse.redirect(redirectUrl)
}

export const config = {
	matcher: ['/services/:path*', '/register', '/home', '/logout'],
}
