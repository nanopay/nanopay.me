export interface ProjectCreate {
	name: string
	description: string
	avatar_url?: string
}

export interface Project extends ProjectCreate {
	display_name: string
	website: string | null
	contact_email: string | null
}
