'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/services/client'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const deleteApiKey = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: apiKeyId }) => {
		const client = new Client(cookies())
		await client.apiKeys.delete(apiKeyId)
		revalidateTag('')
	})
