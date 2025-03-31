'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, passwordSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
	password: passwordSchema,
	next: z.string().optional(),
})

export const changePassword = safeAction
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const client = new Client(await cookies())
		await client.auth.changePassword(parsedInput.password)
		await redirect(parsedInput.next || '/account')
	})
