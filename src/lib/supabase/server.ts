import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/database'
import type { cookies } from 'next/headers'
import { SupabaseSafeSession, SupabaseSafeUserResponse } from './supabase-safe-session'
import { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const jwtSecret = process.env.SUPABASE_JWT_SECRET!

export interface SafeSupabaseClient<Database = any> extends SupabaseClient<Database> {
	getUser: () => Promise<SupabaseSafeUserResponse>
}

export const createClient = (
	cookieStore: Awaited<ReturnType<typeof cookies>>,
): SafeSupabaseClient => {
	const client = createServerClient<Database>(supabaseUrl, supabaseKey, {
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
	}) as SafeSupabaseClient
	const safeSession = new SupabaseSafeSession(client, jwtSecret)
	client.getUser = () => safeSession.getUser()
	return client
}

export const getSafeUser = async (
	cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
	const supabase = createClient(cookieStore)
	const safeUserSession = new SupabaseSafeSession(supabase, jwtSecret)
	const { data, error } = await safeUserSession.getUser()
	if (error) {
		throw new Error(error.message)
	}
	return data
}

export const getUserId = async (
	cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
	const { id } = await getSafeUser(cookieStore)
	return id
}

export const getUserEmail = async (
	cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
	const { email } = await getSafeUser(cookieStore)
	if (!email) {
		throw new Error('No email found')
	}
	return email
}
