'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email(),
})

export const sendMagicLink = safeAction
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const client = new Client(await cookies())
		await client.auth.sendMagicLink(parsedInput.email)
		redirect(`/magic-link/sent?email=${parsedInput.email}`)
	})
