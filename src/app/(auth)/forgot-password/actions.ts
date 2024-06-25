'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const resetPassword = async (email: string) => {
	const client = new Client(cookies())
	await client.auth.resetPasswordForEmail(email)
	await redirect(`/verify-email?email=${email}`)
}
