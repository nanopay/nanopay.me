export interface ServiceCreate {
	name: string
	avatar_url: string
	description: string
}

export interface Service extends ServiceCreate {
	id: string
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
