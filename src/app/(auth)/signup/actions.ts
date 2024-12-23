'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { signWithEmailAndPasswordSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpWithPassword = safeAction
	.schema(signWithEmailAndPasswordSchema)
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())
		const { session } = await client.auth.signUpWithEmailAndPassword({
			email: parsedInput.email,
			password: parsedInput.password,
		})
		if (session) {
			// If session is returned, it means the sign up confirmation is not required
			// The user is already signed in and can complete their profile
			redirect(`/complete-profile`)
		}
		redirect(`/otp?email=${parsedInput.email}&type=signup`)
	})
