'use server'

import { Client } from '@/services/client'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export async function deleteApiKey(apiKeyId: string) {
	try {
		const client = new Client(cookies())
		await client.apiKeys.delete(apiKeyId)
		revalidateTag('')
	} catch (error) {
		console.error('Failed to delete API key:', error)
	}
}
