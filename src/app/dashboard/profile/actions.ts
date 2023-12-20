'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { UserEditables } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { revalidateTag } from 'next/cache'

export const updateUser = async ({ name, avatar_url }: UserEditables) => {
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

	const { error: createError } = await supabase
		.from('profiles')
		.update({
			name,
			avatar_url: avatar_url || DEFAULT_AVATAR_URL,
		})
		.eq('user_id', user.id)

	if (createError) {
		throw new Error(createError.message)
	}

	revalidateTag(`user-${user.id}`)
}
