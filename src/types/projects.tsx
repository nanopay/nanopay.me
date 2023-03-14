export interface ProjectCreate {
	name: string
	avatar_url: string
	description: string
}

export interface Project extends ProjectCreate {
	display_name: string
	website: string | null
	contact_email: string | null
}

export interface ApiKeyCreate {
	name: string
	description: string
	project: string
}

export interface ApiKey extends ApiKeyCreate {
	id: string
	created_at: string
	scopes: string[]
}
