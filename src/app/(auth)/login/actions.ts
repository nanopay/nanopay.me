'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signWithPassword = async ({
	email,
	password,
	next,
}: {
	email: string
	password: string
	next?: string
}) => {
	try {
		const client = new Client(cookies())
		await client.auth.signInWithEmailAndPassword({
			email,
			password,
		})
		redirect(next || '/')
	} catch (error) {
		if (error) {
			if (error instanceof Error && error.message === 'Email not confirmed') {
				redirect(`/verify-email?email=${email}`)
			}
			throw error
		}
	}
}

export const signWithGithub = async ({ next }: { next?: string }) => {
	const client = new Client(cookies())
	const { url } = await client.auth.signInWithGithub({ next })
	redirect(url)
}
