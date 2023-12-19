export interface UserEditables {
	name: string
	avatar_url: string
}

export interface UserProfile extends UserEditables {
	email: string
}

export interface User extends UserProfile {
	id: string
}
