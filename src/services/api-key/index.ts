import 'server-only'

import {
	generateApiKey,
	verifyApiKeyWithChecksum,
} from '@/services/api-key/api-key-utis'
import { apiKeyCreateSchema } from './api-key-schema'
import { z } from 'zod'
import { insertApiKey, retrieveApiKeyFromChecksum } from './api-key-repository'
import { ApiKeyCreate } from './api-key-types'

export const createApiKey = async ({
	service_id,
	name,
	description,
}: ApiKeyCreate) => {
	try {
		apiKeyCreateSchema.parse({ service_id, name, description })

		const { apiKey, checksum } = generateApiKey()

		console.log('generated api key', apiKey)

		await insertApiKey({
			service_id,
			name,
			description,
			checksum,
			scopes: ['*'],
		})

		return { apiKey, checksum }
	} catch (error) {
		console.error('Error creating API key', error)
		throw new Error('Error creating API key')
	}
}

export const retrieveApiKey = async (apiKey: string) => {
	z.string().uuid().parse(apiKey)

	const { checksum, isValid } = verifyApiKeyWithChecksum(apiKey)

	if (!isValid) {
		throw new Error('Invalid API key')
	}

	const data = await retrieveApiKeyFromChecksum(checksum)

	return data
}
