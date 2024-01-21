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

	const { error } = await supabase.auth.signUp({
		email,
		password,
	})

	if (error) {
		throw new Error(error.message)
	}

	redirect(`/verify-email?email=${email}`)
}
