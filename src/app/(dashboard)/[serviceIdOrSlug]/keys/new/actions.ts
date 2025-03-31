'use server'

import { safeAction } from '@/lib/safe-action'
import {
	Client,
	apiKeyCreateSchema,
	serviceNameOrIdSchema,
} from '@/core/client'
import { cookies } from 'next/headers'

export const createNewApiKey = safeAction
	.schema(apiKeyCreateSchema.extend({ serviceIdOrSlug: serviceNameOrIdSchema }))
	.action(async ({ parsedInput }) => {
		const client = new Client(await cookies())

		const { apiKey, checksum } = await client.apiKeys.create(
			parsedInput.serviceIdOrSlug,
			{
				name: parsedInput.name,
				description: parsedInput.description,
			},
		)

		return { apiKey, checksum }
	})
