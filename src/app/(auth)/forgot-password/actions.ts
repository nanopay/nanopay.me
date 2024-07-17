'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email(),
})

export const resetPassword = safeAction
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())
		await client.auth.resetPasswordForEmail(parsedInput.email)
		await redirect(`/verify-email?email=${parsedInput.email}`)
	})
