'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { UserEditables } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'

export const registerUser = async ({ name, avatar_url }: UserEditables) => {
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
		avatar_url: avatar_url || DEFAULT_AVATAR_URL,
	} as any)

	if (createError) {
		throw new Error(createError.message)
	}

	redirect('/home')
}
