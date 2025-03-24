import { InvoicesService } from './invoices/invoices-service'
import { ServicesService } from './services/services-service'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { ApiKeysService } from './api-keys'
import { UsersAdminService } from './users/users-service'
import { SponsorsService } from './sponsors'
export class AdminClient {
	readonly services: ServicesService
	readonly users: UsersAdminService
	readonly invoices: InvoicesService
	readonly apiKeys: ApiKeysService
	readonly sponsors: SponsorsService

	constructor() {
		// BE CAREFUL! Never expose this client to other parts of the application.
		const supabase = createClient<Database>(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_SECRET_KEY!,
		)

		this.services = new ServicesService(supabase)
		this.users = new UsersAdminService(supabase)
		this.invoices = new InvoicesService(supabase)
		this.apiKeys = new ApiKeysService(supabase)
		this.sponsors = new SponsorsService(supabase)
	}
}
