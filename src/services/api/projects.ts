import { ProjectProfile } from '@/types/projects'
import { AxiosInstance } from 'axios'

export const projects = (axiosInstance: AxiosInstance) => {
	return {
		create: async (data: ProjectProfile) => {
			return axiosInstance.post('/projects', data)
		},
	}
}
