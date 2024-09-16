'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { Client, userCreateSchema } from '@/core/client'
import { getUserId } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { safeAction } from '@/lib/safe-action'

export const createUserProfile = safeAction
	.schema(userCreateSchema)
	.action(async ({ parsedInput }) => {
		const userId = await getUserId(cookies())

		const client = new Client(cookies())

		await client.user.createProfile({
			name: parsedInput.name,
			avatar_url: parsedInput.avatar_url || DEFAULT_AVATAR_URL,
		})

		revalidateTag(`user-${userId}`)

		redirect('/')
	})
