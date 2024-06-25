'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const sendMagicLink = async (email: string) => {
	const client = new Client(cookies())
	await client.auth.sendMagicLink(email)
	redirect(`/verify-email?email=${email}`)
}
