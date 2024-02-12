'use server'

import { SITE_URL } from '@/constants'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signWithPassword = async ({
	email,
	password,
	next,
}: {
	email: string
	password: string
	next?: string
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

	redirect(next || `/home`)
}

export const signWithGithub = async ({ next }: { next?: string }) => {
	const supabase = createClient(cookies())

	const redirectTo = new URL(SITE_URL)
	redirectTo.pathname = '/auth/callback'
	if (next) {
		redirectTo.searchParams.set('next', next)
	}

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
		options: {
			redirectTo: redirectTo.toString(),
		},
	})

	if (error) {
		throw new Error(error.message)
	}

	redirect(data.url)
}
