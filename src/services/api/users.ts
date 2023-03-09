import { UserProfile } from '@/types/users'
import { AxiosInstance } from 'axios'

export const users = (axiosInstance: AxiosInstance) => {
	return {
		register: async (data: UserProfile) => {
			return axiosInstance.post('/users/register', data)
		},
	}
}
