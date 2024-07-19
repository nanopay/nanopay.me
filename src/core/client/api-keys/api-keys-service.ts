import { z } from 'zod'
import { checkUUID } from '@/core/utils'
import { BaseService } from '../base-service'
import { apiKeyCreateSchema, apiKeySchema } from './api-keys-schemas'
import { ApiKey, ApiKeyCreate } from './api-keys-types'
import { generateApiKey, verifyApiKeyWithChecksum } from './api-key-utis'
import { serviceNameSchema } from '../services'

export class ApiKeysService extends BaseService {
	async create(
		serviceIdOrSlug: string,
		data: ApiKeyCreate,
	): Promise<{ apiKey: string; checksum: string }> {
		apiKeyCreateSchema.parse(data)

		const serviceId = await this.getIdFromServiceIdOrSlug(serviceIdOrSlug)

		const { apiKey, checksum } = generateApiKey()

		const { error } = await this.supabase.from('api_keys').insert({
			service_id: serviceId,
			name: data.name,
			description: data.description,
			checksum: checksum,
			scopes: ['*'],
		})

		if (error) {
			throw new Error(error.message)
		}

		return { apiKey, checksum }
	}

	async get(apiKey: string): Promise<ApiKey> {
		z.string().uuid().parse(apiKey)

		const { checksum, isValid } = verifyApiKeyWithChecksum(apiKey)

		if (!isValid) {
			throw new Error('Invalid API key')
		}

		const { data, error } = await this.supabase
			.from('api_keys')
			.select('*')
			.eq('checksum', checksum)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		apiKeySchema.parse(data)

		return data
	}

	async list(serviceIdOrSlug: string): Promise<ApiKey[]> {
		const query = this.supabase
			.from('api_keys')
			.select('*, service:services!inner(name)')

		if (checkUUID(serviceIdOrSlug)) {
			query.eq('service_id', serviceIdOrSlug)
		} else {
			serviceNameSchema.parse(serviceIdOrSlug)
			query.eq('service.slug', serviceIdOrSlug)
		}

		const { data, error } = await query

		if (error) {
			throw new Error(error.message)
		}

		z.array(apiKeySchema).parse(data)

		return data || []
	}

	async update(checksum: string, data: any): Promise<void> {
		throw new Error('Not implemented')
	}

	async delete(checksum: string): Promise<void> {
		const { error } = await this.supabase
			.from('api_keys')
			.delete()
			.eq('checksum', checksum)
			.select('checksum')
			.single()

		if (error) {
			throw new Error(error.message)
		}
	}
}
