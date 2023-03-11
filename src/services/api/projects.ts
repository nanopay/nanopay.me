import { Project, ProjectProfile } from '@/types/projects'
import { AxiosInstance, AxiosResponse } from 'axios'

export const projects = (axiosInstance: AxiosInstance) => {
	return {
		create: async (
			data: ProjectProfile,
		): Promise<AxiosResponse<{ id: string }>> => {
			return axiosInstance.post('/projects', data)
		},
		get: async (id: string): Promise<AxiosResponse<Project>> => {
			return axiosInstance.get(`/projects/${id}`)
		},
		getAll: async (): Promise<AxiosResponse<Project[]>> => {
			return axiosInstance.get('/projects')
		},
	}
}
