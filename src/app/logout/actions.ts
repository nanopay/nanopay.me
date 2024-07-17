'use server'

import { safeAction } from '@/lib/safe-action'
import { Client } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOut = safeAction.action(async () => {
	const client = new Client(cookies())
	await client.auth.signOut()
	redirect('/')
})
