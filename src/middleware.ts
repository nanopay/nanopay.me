import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()

	try {
		// Create authenticated Supabase Client.
		const supabase = createMiddlewareSupabaseClient({ req, res })

		// Check if we have a session
		const {
			data: { session },
		} = await supabase.auth.getSession()

		let pathname = '/login'

		const role = session?.user?.role
		const confirmedRegistration =
			session?.user?.user_metadata?.confirmed_registration

		if (role === 'authenticated') {
			if (confirmedRegistration) {
				return res
			} else {
				pathname = '/register'
			}
		}

		// Auth condition not met, redirect to login or register page.
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = pathname
		redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
		return NextResponse.redirect(redirectUrl)
	} catch (err: any) {
		console.error(err)
		return NextResponse.redirect('/500?message=' + err.message)
	}
}

export const config = {
	matcher: ['/services/:path*', '/home'],
}
