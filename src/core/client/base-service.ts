import { Database } from '@/types/database'
import { checkUUID } from '@/core/utils'
import { SafeSupabaseClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

export class BaseService {
	supabase: SupabaseClient<Database> | SafeSupabaseClient<Database>

	constructor(instance: SupabaseClient<Database> | SafeSupabaseClient<Database>) {
		this.supabase = instance
	}

	logger = (message: string) => {
		console.info(message)
	}

	getUserId = async () => {
		if (!('getUser' in this.supabase)) {
			throw new Error('Cannot use .getUser() inside AdminClient')
		}
		const { data, error } = await this.supabase.getUser()
		if (error) {
			throw new Error(error.message)
		}
		return data.id
	}

	isServiceOwner = async (serviceIdOrSlug: string) => {
		const userId = await this.getUserId()
		const serviceOwnerId = await this.getServiceOwnerId(serviceIdOrSlug)
		return userId === serviceOwnerId
	}

	getServiceOwnerId = async (serviceIdOrSlug: string) => {
		const query = this.supabase.from('services').select('user_id')

		if (checkUUID(serviceIdOrSlug)) {
			query.eq('id', serviceIdOrSlug)
		} else {
			query.eq('slug', serviceIdOrSlug)
		}

		const { data, error } = await query.single()

		if (error) {
			throw new Error(error.message)
		}

		return data.user_id
	}

	getIdFromServiceIdOrSlug = async (serviceIdOrSlug: string) => {
		if (checkUUID(serviceIdOrSlug)) {
			return serviceIdOrSlug
		}

		const { data, error } = await this.supabase
			.from('services')
			.select('id')
			.eq('slug', serviceIdOrSlug)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return data.id
	}
}
