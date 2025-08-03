'use server'

import { Client, signWithEmailAndPasswordSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { SITE_URL } from '@/core/constants'

export const signWithPassword = safeAction
	.schema(
		signWithEmailAndPasswordSchema.extend({
			next: z.string().optional().nullable(),
		}),
	)
	.action(async ({ parsedInput: { email, password, next } }) => {
		try {
			const client = new Client(await cookies())
			await client.auth.signInWithEmailAndPassword({
				email,
				password,
			})
			redirect(next || '/')
		} catch (error) {
			if (error) {
				if (error instanceof Error && error.message === 'Email not confirmed') {
					redirect(`/otp?email=${email}&type=signup`)
				}
				throw error
			}
		}
	})

export const signWithGithub = safeAction
	.schema(z.object({ next: z.string().optional().nullable() }))
	.action(async ({ parsedInput: { next } }) => {
		const redirectTo = new URL(SITE_URL)
		redirectTo.pathname = '/auth/callback'
		if (next) {
			redirectTo.searchParams.set('next', next)
		}

		const client = new Client(await cookies())
		const { url } = await client.auth.signInWithGithub({
			redirectTo: redirectTo.toString(),
		})
		redirect(url)
	})
