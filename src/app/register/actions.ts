'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { UserProfile } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'

export const registerUser = async ({
	name,
	email,
	avatar_url,
}: UserProfile) => {
	const supabase = createClient(cookies())

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError) {
		throw new Error(authError.message)
	}

	if (!user) {
		throw new Error('Unauthorized')
	}

	const { error: createError } = await supabase.from('profiles').insert({
		user_id: user.id,
		name,
		email,
		avatar_url: avatar_url || DEFAULT_AVATAR_URL,
	})

	if (createError) {
		throw new Error(createError.message)
	}

	await supabase.auth.refreshSession()

	redirect('/home')
}
