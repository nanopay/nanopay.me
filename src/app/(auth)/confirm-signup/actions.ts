'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, verifyOtpSchema } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const verifySignUp = safeAction
	.schema(
		verifyOtpSchema.extend({
			next: z.string().optional().nullable(),
		}),
	)
	.action(async ({ parsedInput: { email, token, next } }) => {
		const client = new Client(cookies())
		await client.auth.verifySignUpWithOtp({
			email,
			token,
		})

		let redirectTo = '/'
		if (next) redirectTo += `?next=${next}`
		redirect(redirectTo)
	})
