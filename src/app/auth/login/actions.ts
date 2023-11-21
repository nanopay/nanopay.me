'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signWithPassword = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	const supabase = createClient(cookies())

	if (!email || !password) {
		throw new Error('Email or password is missing')
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})
	if (error) {
		if (error.message === 'Email not confirmed') {
			redirect(`/verify-email?email=${email}`)
		}
		throw new Error(error.message)
	}
	if (!data.session) {
		throw new Error('Session is missing')
	}

	const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires

	redirect(`/home`)
}

export const signWithGithub = async (redirectTo: string) => {
	const supabase = createClient(cookies())

	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo,
		},
	})
	if (error) {
		throw new Error(error.message)
	}
}
