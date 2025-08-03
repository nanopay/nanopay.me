'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, verifyOtpSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const verifyOTP = safeAction
	.schema(
		verifyOtpSchema.extend({
			next: z.string().optional().nullable(),
		}),
	)
	.action(async ({ parsedInput: { email, token, type, next } }) => {
		const client = new Client(await cookies())
		await client.auth.verifyOtp({
			email,
			token,
			type,
		})

		let redirectTo = type === 'recovery' ? '/change-password' : '/'
		if (next) redirectTo += `?next=${next}`
		redirect(redirectTo)
	})
