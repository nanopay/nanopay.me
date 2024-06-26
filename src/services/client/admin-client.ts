import { InvoicesService } from './invoices/invoices-service'
import { ServicesService } from './services/services-service'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// BE CAREFUL! Never expose this client to other parts of the application.
const supabase = createClient<Database>(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SECRET_KEY!,
)

export class AdminClient {
	readonly services: ServicesService
	readonly invoices: InvoicesService

	constructor() {
		this.services = new ServicesService(supabase)
		this.invoices = new InvoicesService(supabase)
	}
}
