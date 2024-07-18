import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/database'
import type { cookies } from 'next/headers'
import { SupabaseSafeSession } from './supabase-safe-session'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const jwtSecret = process.env.SUPABASE_JWT_SECRET!

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

export const getSafeUser = async (cookieStore: ReturnType<typeof cookies>) => {
	const supabase = createClient(cookieStore)
	const safeUserSession = new SupabaseSafeSession(supabase, jwtSecret)
	const { data, error } = await safeUserSession.getUser()
	if (error) {
		throw new Error(error.message)
	}
	return data
}

export const getUserId = async (cookieStore: ReturnType<typeof cookies>) => {
	const { id } = await getSafeUser(cookieStore)
	return id
}

export const getUserEmail = async (cookieStore: ReturnType<typeof cookies>) => {
	const { email } = await getSafeUser(cookieStore)
	return email
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
