import { Database } from '@/types/database'
import { checkUUID } from '@/utils/helpers'
import { SupabaseClient } from '@supabase/supabase-js'

export class BaseService {
	supabase: SupabaseClient<Database>

	constructor(instance: SupabaseClient<Database>) {
		this.supabase = instance
	}

	logger = (message: string) => {
		console.info(message)
	}

	getUserId = async () => {
		const {
			data: { session },
		} = await this.supabase.auth.getSession()

		if (!session?.user) {
			throw new Error('No user data')
		}
		return session.user.id
	}

	isServiceOwner = async (serviceNameOrId: string) => {
		const userId = await this.getUserId()
		const serviceOwnerId = await this.getServiceOwnerId(serviceNameOrId)
		return userId === serviceOwnerId
	}

	getServiceOwnerId = async (serviceNameOrId: string) => {
		const query = this.supabase.from('services').select('user_id')

		if (checkUUID(serviceNameOrId)) {
			query.eq('id', serviceNameOrId)
		} else {
			query.eq('name', serviceNameOrId)
		}

		const { data, error } = await query.single()

		if (error) {
			throw new Error(error.message)
		}

		return data.user_id
	}

	getIdFromServiceNameOrId = async (serviceNameOrId: string) => {
		if (checkUUID(serviceNameOrId)) {
			return serviceNameOrId
		}

		const { data, error } = await this.supabase
			.from('services')
			.select('id')
			.eq('name', serviceNameOrId)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return data.id
	}
}
