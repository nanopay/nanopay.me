'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const sendMagicLink = async (email: string) => {
	const supabase = createClient(cookies())

	const { error } = await supabase.auth.signInWithOtp({ email })
	if (error) {
		throw new Error(error.message)
	} else {
		redirect(`/verify-email?email=${email}`)
	}
}
