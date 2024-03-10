export interface ServiceCreate {
	name: string
	avatar_url?: string | null
	description?: string | null
}

export interface PublicService {
	name: string
	display_name: string
	avatar_url: string | null
	description: string | null
	website: string | null
	contact_email: string | null
}

export interface Service extends ServiceCreate {
	id: string
	user_id: string
	display_name: string
	website: string | null
	contact_email: string | null
	invoices_count: number
	api_keys_count: number
	hooks_count: number
	created_at: string
}

export interface ApiKeyCreate {
	name: string
	description: string
	service: string
}

export interface ApiKey extends ApiKeyCreate {
	id: string
	created_at: string
	scopes: string[]
}
