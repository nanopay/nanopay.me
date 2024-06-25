'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signUpWithPassword = async ({
	email,
	password,
}: {
	email: string
	password: string
}) => {
	const client = new Client(cookies())
	await client.auth.signUpWithEmailAndPassword({
		email,
		password,
	})

	redirect(`/verify-email?email=${email}`)
}
