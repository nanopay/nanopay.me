'use server'

import { cookies } from 'next/headers'
import { getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { Client, userUpdateSchema } from '@/core/client'
import { safeAction } from '@/lib/safe-action'

export const updateUser = safeAction
	.schema(userUpdateSchema)
	.action(async ({ parsedInput }) => {
		const userId = await getUserId(cookies())

		const client = new Client(cookies())

		await client.user.updateProfile(parsedInput)

		revalidateTag(`user-${userId}`)
	})
