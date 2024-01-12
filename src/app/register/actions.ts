'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient, getUserId } from '@/utils/supabase/server'
import { UserEditables } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { Database } from '@/types/supabase'

export const registerUser = async ({ name, avatar_url }: UserEditables) => {
	const userId = await getUserId(cookies())

	const supabase = createClient(cookies())

	const { error: createError } = await supabase.from('profiles').insert({
		user_id: userId,
		name,
		avatar_url: avatar_url || DEFAULT_AVATAR_URL,
	} as Database['public']['Tables']['profiles']['Insert'])

	if (createError) {
		throw new Error(createError.message)
	}

	redirect('/home')
}
