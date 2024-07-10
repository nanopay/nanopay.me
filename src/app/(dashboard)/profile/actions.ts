'use server'

import { cookies } from 'next/headers'
import { getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { Client } from '@/services/client'

export interface UpdateUserProps {
	name: string
}

export const updateUser = async ({ name }: Partial<UpdateUserProps>) => {
	const userId = await getUserId(cookies())

	const client = new Client(cookies())

	await client.user.updateProfile({
		name,
	})

	revalidateTag(`user-${userId}`)
}
