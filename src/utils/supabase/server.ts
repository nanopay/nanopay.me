import 'server-only'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/database'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
	return createServerClient<Database>(supabaseUrl, supabaseKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value
			},
			set(name: string, value: string, options: CookieOptions) {
				cookieStore.set({ name, value, ...options })
			},
			remove(name: string, options: CookieOptions) {
				cookieStore.set({ name, value: '', ...options })
			},
		},
	})
}

export const getUserId = async (cookieStore: ReturnType<typeof cookies>) => {
	const supabase = createClient(cookieStore)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		throw new Error('No user data')
	}
	return session.user.id
}

export const isAuthenticated = async (
	cookieStore: ReturnType<typeof cookies>,
) => {
	try {
		const supabase = createClient(cookieStore)

		const {
			data: { session },
		} = await supabase.auth.getSession()

		return !!session
	} catch {
		return false
	}
}
