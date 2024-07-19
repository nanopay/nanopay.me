'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { getUserId } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const deleteService = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: serviceIdOrSlug }) => {
		const userId = await getUserId(cookies())

		const client = new Client(cookies())

		await client.services.delete(serviceIdOrSlug)

		revalidateTag(`service-${serviceIdOrSlug}`)
		revalidateTag(`user-${userId}-services`)

		redirect('/')
	})
