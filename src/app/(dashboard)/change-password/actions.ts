'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, passwordSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const changePassword = safeAction
	.schema(passwordSchema)
	.action(async ({ parsedInput: password }) => {
		const client = new Client(cookies())
		await client.auth.changePassword(password)
		await redirect(`/account`)
	})
