'use server'

import { ApiKeyCreate, Client } from '@/services/client'
import { cookies } from 'next/headers'

export const createNewApiKey = async (
	serviceNameOrId: string,
	data: ApiKeyCreate,
) => {
	const client = new Client(cookies())

	const { apiKey, checksum } = await client.apiKeys.create(serviceNameOrId, {
		name: data.name,
		description: data.description,
		scopes: data.scopes,
	})

	return { apiKey, checksum }
}
