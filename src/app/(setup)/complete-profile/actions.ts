'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { Client, UserCreate } from '@/services/client'
import { getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'

export const createUserProfile = async ({ name, avatar_url }: UserCreate) => {
	const userId = await getUserId(cookies())

	const client = new Client(cookies())

	await client.user.createProfile({
		name,
		avatar_url: avatar_url || DEFAULT_AVATAR_URL,
	})

	revalidateTag(`user-${userId}-profile`)

	redirect('/')
}
