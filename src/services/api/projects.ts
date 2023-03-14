import { ApiKeyCreate, Project, ProjectCreate } from '@/types/projects'
import { concatURL } from '@/utils/helpers'
import { AxiosInstance, AxiosResponse } from 'axios'
import s3 from '../s3'

export const projects = (axiosInstance: AxiosInstance) => {
	return {
		create: async (
			data: ProjectCreate,
		): Promise<AxiosResponse<{ id: string }>> => {
			return axiosInstance.post('/projects', data)
		},
		get: async (projectName: string): Promise<AxiosResponse<Project>> => {
			return axiosInstance.get(`/projects/${projectName}`)
		},
		getAll: async (): Promise<AxiosResponse<Project[]>> => {
			return axiosInstance.get('/projects')
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
					.post('/upload/image')
					.then(res => res.data)
				await s3.uploadObject(file, fields, url, progressCallback)
				return concatURL(
					`https://${process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST}`,
					fields.key,
				)
			},
		},
		apiKeys: {
			create: async (
				projectId: string,
				data: ApiKeyCreate,
			): Promise<AxiosResponse<{ id: string }>> => {
				return axiosInstance.post(`/projects/${projectId}/keys`, data)
			},
			get: async (
				projectId: string,
				id: string,
			): Promise<AxiosResponse<{ id: string; key: string }>> => {
				return axiosInstance.get(`/projects/${projectId}/api-keys/${id}`)
			},
		},
	}
}
