import { BaseService } from '../base-service'

export class UsersAdminService extends BaseService {
	async delete(userId: string): Promise<void> {
		const { error } = await this.supabase.auth.admin.deleteUser(userId)

		if (error) {
			throw new Error(error.message)
		}
	}
}
