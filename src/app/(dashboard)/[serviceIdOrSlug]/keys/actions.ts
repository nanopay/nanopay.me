'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const deleteApiKey = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: checksum }) => {
		const client = new Client(await cookies())
		await client.apiKeys.delete(checksum)
		revalidateTag('')
	})
