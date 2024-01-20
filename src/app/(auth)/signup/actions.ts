'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpWithPassword = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	const supabase = createClient(cookies())

	const { error, data } = await supabase.auth.signUp({
		email,
		password,
	})
	if (error) {
		throw new Error(error.message)
	} else {
		redirect(`/verify-email?email=${email}`)
	}
}
