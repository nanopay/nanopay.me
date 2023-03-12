import { UserProfile } from '@/types/users'
import { AxiosInstance } from 'axios'
import s3 from '../s3'

export const users = (axiosInstance: AxiosInstance) => {
	return {
		register: async (data: UserProfile) => {
			return axiosInstance.post('/users/register', data)
		},
		upload: {
			avatar: async (
				file: File,
				progressCallback?: (progress: number) => void,
			): Promise<string> => {
				if (file.size > 1024 * 1024 * 5) {
					throw new Error('File size must be less than 5MB')
				}
				const { url, fields } = await axiosInstance
					.post('/users/upload/avatar')
					.then(res => res.data)
				await s3.uploadObject(file, fields, url, progressCallback)
				return `https://${process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST}/${fields.key}`
			},
		},
	}
}
