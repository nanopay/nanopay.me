'use server'

import { cookies } from 'next/headers'
import { getUserId } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { AdminClient, Client, userUpdateSchema } from '@/core/client'
import { safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { redirect } from 'next/navigation'

export const updateUser = safeAction
	.schema(userUpdateSchema)
	.action(async ({ parsedInput }) => {
		const userId = await getUserId(cookies())

		const client = new Client(cookies())

		await client.user.updateProfile(parsedInput)

		revalidateTag(`user-${userId}`)
	})

export const deleteUser = safeAction.schema(z.any()).action(async () => {
	const userId = await getUserId(cookies())

	const adminClient = new AdminClient()
	await adminClient.users.delete(userId)

	cookies()
		.getAll()
		.forEach(cookie => {
			cookies().delete(cookie.name)
		})

	revalidateTag(`user-${userId}`)

	redirect('/')
})
