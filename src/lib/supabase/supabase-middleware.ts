import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest } from 'next/server'

export function createSupabaseClientForMiddleware(request: NextRequest) {
	const supabase = createServerClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					})
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: '',
						...options,
					})
				},
			},
		},
	)

	return { supabase }
}

export async function updateSupabaseSessionForMiddleware(request: NextRequest) {
	const { supabase } = await createSupabaseClientForMiddleware(request)
	const { data, error } = await supabase.auth.getSession()
	const isAuthenticated = !error && !!data.session
	return { isAuthenticated }
}
