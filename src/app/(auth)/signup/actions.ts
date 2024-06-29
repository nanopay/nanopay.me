'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/services/client'
import { signWithEmailAndPasswordSchema } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpWithPassword = safeAction
	.schema(signWithEmailAndPasswordSchema)
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())
		await client.auth.signUpWithEmailAndPassword({
			email: parsedInput.email,
			password: parsedInput.password,
		})
		redirect(`/verify-email?email=${parsedInput.email}`)
	})
