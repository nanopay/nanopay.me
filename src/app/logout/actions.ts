'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOut = async () => {
	const client = new Client(cookies())
	await client.auth.signOut()
	redirect('/')
}
