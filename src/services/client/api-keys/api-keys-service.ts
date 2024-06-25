import { checkUUID } from '@/utils/helpers'
import { BaseService } from '../base-service'
import { apiKeyCreateSchema, apiKeySchema } from './api-keys-schemas'
import { ApiKey, ApiKeyCreate } from './api-keys-types'
import { z } from 'zod'
import { createApiKey } from '@/services/api-key'

export class ApiKeysService extends BaseService {
	async create(
		serviceNameOrId: string,
		data: ApiKeyCreate,
	): Promise<{ apiKey: string; checksum: string }> {
		apiKeyCreateSchema.parse(data)

		const isOwner = await this.isServiceOwner(serviceNameOrId)

		if (!isOwner) {
			throw new Error('Not authorized')
		}

		const serviceId = await this.getIdFromServiceNameOrId(serviceNameOrId)

		const { apiKey, checksum } = await createApiKey({
			service_id: serviceId,
			name: data.name,
			description: data.description,
			scopes: data.scopes,
		})

		return { apiKey, checksum }
	}

	async get(apiKeyId: string): Promise<ApiKey> {
		const { data, error } = await this.supabase
			.from('api_keys')
			.select('*, service:services(name)')
			.eq('id', apiKeyId)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		apiKeySchema.parse(data)

		return data
	}

	async list(serviceIdOrName: string): Promise<ApiKey[]> {
		this.logger('Fetching API keys')
		const query = this.supabase
			.from('api_keys')
			.select('*, service:services(name)')

		if (checkUUID(serviceIdOrName)) {
			query.eq('service_id', serviceIdOrName)
		} else {
			apiKeySchema.partial().parse({ name: serviceIdOrName })
			query.eq('service.name', serviceIdOrName)
		}

		const { data, error } = await query

		if (error) {
			throw new Error(error.message)
		}

		z.array(apiKeySchema).parse(data)

		return data || []
	}

	async update(apiKeyId: string, data: any): Promise<void> {
		throw new Error('Not implemented')
	}

	async delete(apiKeyId: string): Promise<void> {
		const { error } = await this.supabase
			.from('api_keys')
			.delete()
			.eq('id', apiKeyId)
			.select('id')
			.single()

		if (error) {
			throw new Error(error.message)
		}
	}
}
