'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/services/client'
import { getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const deleteService = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: serviceNameOrId }) => {
		const userId = await getUserId(cookies())

		const client = new Client(cookies())

		await client.services.delete(serviceNameOrId)

		revalidateTag(`service-${serviceNameOrId}`)
		revalidateTag(`user-${userId}-services`)

		redirect('/')
	})
