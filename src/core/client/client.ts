import { cookies as nextCookies } from 'next/headers'

import { InvoicesService } from './invoices/invoices-service'
import { WebhooksService } from './webhooks/webhooks-service'
import { ApiKeysService } from './api-keys/api-keys-service'
import { AuthService } from './auth/auth-service'
import { ServicesService } from './services/services-service'
import { UserService } from './user/user-service'
import { createClient } from '@/lib/supabase/server'
import { NotificationsService } from './notifications/notifications-service'

export class Client {
	readonly auth: AuthService
	readonly user: UserService
	readonly services: ServicesService
	readonly invoices: InvoicesService
	readonly webhooks: WebhooksService
	readonly apiKeys: ApiKeysService
	readonly notifications: NotificationsService

	constructor(cookies: ReturnType<typeof nextCookies>) {
		const supabase = createClient(cookies)
		this.auth = new AuthService(supabase)
		this.user = new UserService(supabase)
		this.services = new ServicesService(supabase)
		this.invoices = new InvoicesService(supabase)
		this.webhooks = new WebhooksService(supabase)
		this.apiKeys = new ApiKeysService(supabase)
		this.notifications = new NotificationsService(supabase)
	}
}
