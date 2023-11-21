'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOut = async () => {
	const supabase = createClient(cookies())

	const { error } = await supabase.auth.signOut()
	if (error) {
		throw new Error(error.message)
	}
	redirect('/')
}
