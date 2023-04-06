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
	api_keys_count: number
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
