'use server'

import { handleAction } from '@/lib/handle-action'
import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOut = handleAction(async () => {
	const client = new Client(cookies())
	await client.auth.signOut()
	redirect('/')
})
