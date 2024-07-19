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
import { sanitizeSlug } from '@/utils/url'

export class ServicesService extends BaseService {
	async create(data: ServiceCreate): Promise<{ id: string }> {
		serviceCreateSchema.parse(data)

		const { data: session } = await this.supabase.auth.getSession()
		const userId = session.session?.user.id

		if (!userId) {
			throw new Error('User not found')
		}

		const slug = sanitizeSlug(data.name.replace(' ', '-'))

		const { data: service, error } = await this.supabase
			.from('services')
			.insert({
				user_id: userId,
				slug,
				name: data.name,
				avatar_url: data.avatar_url,
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

	async get(serviceIdOrSlug: string): Promise<Service | null> {
		const query = this.supabase.from('services').select('*')
		if (checkUUID(serviceIdOrSlug)) {
			query.eq('id', serviceIdOrSlug)
		} else {
			serviceNameSchema.parse(serviceIdOrSlug)
			query.eq('name', serviceIdOrSlug)
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

	async update(serviceIdOrSlug: string, data: ServiceUpdate): Promise<void> {
		serviceUpdateSchema.parse(data)
		const query = this.supabase.from('services').update({
			slug: data.slug,
			name: data.name,
			avatar_url: data.avatar_url,
			website: data.website,
			contact_email: data.contact_email,
		})
		if (checkUUID(serviceIdOrSlug)) {
			query.eq('id', serviceIdOrSlug)
		} else {
			serviceNameSchema.parse(serviceIdOrSlug)
			query.eq('name', serviceIdOrSlug)
		}
		const { error } = await query
		if (error) {
			throw new Error(error.message)
		}
	}

	async delete(serviceIdOrSlug: string): Promise<void> {
		const query = this.supabase.from('services').delete()
		if (checkUUID(serviceIdOrSlug)) {
			query.eq('id', serviceIdOrSlug)
		} else {
			serviceNameSchema.parse(serviceIdOrSlug)
			query.eq('name', serviceIdOrSlug)
		}
		const { error } = await query
		if (error) {
			throw new Error(error.message)
		}
	}
}
