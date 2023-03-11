export interface ProjectProfile {
	name: string
	description: string
	avatar_url: string
}

export interface Project extends ProjectProfile {
	id: string
}
