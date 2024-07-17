import { BaseService } from '../base-service'
import { userCreateSchema } from './user-schema'
import { User, UserCreate, UserUpdate } from './user-types'

export class UserService extends BaseService {
	async createProfile(data: UserCreate): Promise<void> {
		userCreateSchema.parse(data)

		const userId = await this.getUserId()

		const { error } = await this.supabase.from('profiles').insert({
			name: data.name,
			avatar_url: data.avatar_url,
			user_id: userId,
		} as any)

		if (error) {
			throw new Error(error.message)
		}
	}

	async getProfile(): Promise<User | null> {
		const userId = await this.getUserId()
		const { data, error } = await this.supabase
			.from('profiles')
			.select('*')
			.eq('user_id', userId)
			.single()
		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}
			throw new Error(error.message)
		}
		return {
			id: data.user_id,
			name: data.name,
			email: data.email,
			avatar_url: data.avatar_url,
			created_at: data.created_at,
		}
	}

	async updateProfile(data: UserUpdate): Promise<void> {
		const userId = await this.getUserId()

		const { error } = await this.supabase
			.from('profiles')
			.update(data)
			.eq('user_id', userId)

		if (error) {
			throw new Error(error.message)
		}
	}

	async delete(): Promise<void> {}
}
