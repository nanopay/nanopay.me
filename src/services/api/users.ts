import { AxiosInstance } from 'axios'

export interface UserRegisterProps {
	name: string
	email: string
	avatar_url: string
}

export const users = (axiosInstance: AxiosInstance) => {
	return {
		register: async (data: UserRegisterProps) => {
			return axiosInstance.post('/users/register', data)
		},
	}
}
