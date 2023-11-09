export interface UserProfile {
	name: string
	email: string
	avatar_url: string
}

export interface User extends UserProfile {
	id: string
}
