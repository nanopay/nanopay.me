export interface UserProfile {
	name: string
	email: string
	avatar_url: string | null
}

export interface User extends UserProfile {
	id: string
}
