import 'server-only'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const createClient = (request: NextRequest) => {
	// Create an unmodified response
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})

	const supabase = createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			get(name: string) {
				return request.cookies.get(name)?.value
			},
			set(name: string, value: string, options: CookieOptions) {
				// If the cookie is updated, update the cookies for the request and response
				request.cookies.set({
					name,
					value,
					...options,
				})
				response = NextResponse.next({
					request: {
						headers: request.headers,
					},
				})
				response.cookies.set({
					name,
					value,
					...options,
				})
			},
			remove(name: string, options: CookieOptions) {
				// If the cookie is removed, update the cookies for the request and response
				request.cookies.set({
					name,
					value: '',
					...options,
				})
				response = NextResponse.next({
					request: {
						headers: request.headers,
					},
				})
				response.cookies.set({
					name,
					value: '',
					...options,
				})
			},
		},
	})

	return { supabase, response }
}
