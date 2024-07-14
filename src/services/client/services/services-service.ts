import { checkUUID } from '@/utils/helpers'
import { BaseService } from '../base-service'
import {
	Service,
	ServiceCreate,
	ServicePagination,
	ServiceUpdate,
} from './service-types'
import {
	serviceCreateSchema,
	serviceNameSchema,
	servicePaginationSchema,
	serviceSchema,
	serviceUpdateSchema,
} from './services-schema'
import { z } from 'zod'

export class ServicesService extends BaseService {
	async create(data: ServiceCreate): Promise<{ id: string }> {
		serviceCreateSchema.parse(data)

		const { data: session } = await this.supabase.auth.getSession()
		const userId = session.session?.user.id

		if (!userId) {
			throw new Error('User not found')
		}

		const { data: service, error } = await this.supabase
			.from('services')
			.insert({
				user_id: userId,
				name: data.name,
				display_name: data.name,
				avatar_url: data.avatar_url,
				description: data.description,
				website: data.website,
				contact_email: data.contact_email,
			})
			.select('id')
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return { id: service.id }
	}

	async get(serviceNameOrId: string): Promise<Service | null> {
		const query = this.supabase.from('services').select('*')
		if (checkUUID(serviceNameOrId)) {
			query.eq('id', serviceNameOrId)
		} else {
			serviceNameSchema.parse(serviceNameOrId)
			query.eq('name', serviceNameOrId)
		}
		const { data, error } = await query.single()
		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}
			throw new Error(error.message)
		}
		return data
	}

	async list(options?: ServicePagination): Promise<Service[]> {
		if (options) {
			servicePaginationSchema.parse(options)
		}
		const offset = options?.offset || 0
		const limit = options?.limit || 20
		const order = options?.order || 'asc'
		const orderBy = options?.order_by || 'created_at'
		const { data, error } = await this.supabase
			.from('services')
			.select('*')
			.range(offset, offset + limit - 1)
			.order(orderBy, { ascending: order === 'asc' })
		if (error) {
			throw new Error(error.message)
		}
		z.array(serviceSchema).parse(data)
		return data
	}

	async update(serviceNameOrId: string, data: ServiceUpdate): Promise<void> {
		serviceUpdateSchema.parse(data)
		const query = this.supabase.from('services').update({
			name: data.name,
			display_name: data.display_name,
			avatar_url: data.avatar_url,
			description: data.description,
			website: data.website,
			contact_email: data.contact_email,
		})
		if (checkUUID(serviceNameOrId)) {
			query.eq('id', serviceNameOrId)
		} else {
			serviceNameSchema.parse(serviceNameOrId)
			query.eq('name', serviceNameOrId)
		}
		const { error } = await query
		if (error) {
			throw new Error(error.message)
		}
	}

	async delete(serviceNameOrId: string): Promise<void> {
		const query = this.supabase.from('services').delete()
		if (checkUUID(serviceNameOrId)) {
			query.eq('id', serviceNameOrId)
		} else {
			serviceNameSchema.parse(serviceNameOrId)
			query.eq('name', serviceNameOrId)
		}
		const { error } = await query
		if (error) {
			throw new Error(error.message)
		}
	}
}
