'use server'

import { safeAction } from '@/lib/safe-action'
import {
	Client,
	apiKeyCreateSchema,
	serviceNameOrIdSchema,
} from '@/services/client'
import { cookies } from 'next/headers'

export const createNewApiKey = safeAction
	.schema(apiKeyCreateSchema.extend({ serviceNameOrId: serviceNameOrIdSchema }))
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())

		const { apiKey, checksum } = await client.apiKeys.create(
			parsedInput.serviceNameOrId,
			{
				name: parsedInput.name,
				description: parsedInput.description,
			},
		)

		return { apiKey, checksum }
	})
