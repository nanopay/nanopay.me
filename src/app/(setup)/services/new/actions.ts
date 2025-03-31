'use server'

import { Client, serviceCreateSchema } from '@/core/client'
import { getUserId } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { safeAction } from '@/lib/safe-action'

export const createService = safeAction
	.schema(serviceCreateSchema)
	.action(async ({ parsedInput }) => {
		const userId = await getUserId(await cookies())

		const client = new Client(await cookies())

		const { slug } = await client.services.create(parsedInput)

		revalidateTag(`user-${userId}-services`)

		redirect(`/${slug}?new=true`)
	})
