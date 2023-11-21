import 'server-only'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/supabase'
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
