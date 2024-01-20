'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const resetPassword = async (email: string) => {
	const supabase = createClient(cookies())

	const { error } = await supabase.auth.resetPasswordForEmail(email)
	if (error) {
		throw new Error(error.message)
	} else {
		await redirect(`/verify-email?email=${email}`)
	}
}
