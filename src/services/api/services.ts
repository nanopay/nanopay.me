import { Hook, HookCreate } from '@/types/hooks'
import { ApiKey, ApiKeyCreate, Service, ServiceCreate } from '@/types/services'
import { concatURL } from '@/utils/helpers'
import { AxiosInstance, AxiosResponse } from 'axios'
import s3 from '../s3'

export const services = (axiosInstance: AxiosInstance) => {
	return {
		create: async (
			data: ServiceCreate,
		): Promise<AxiosResponse<{ id: string }>> => {
			return axiosInstance.post('/services', data)
		},
		get: async (serviceName: string): Promise<AxiosResponse<Service>> => {
			return axiosInstance.get(`/services/${serviceName}`)
		},
		list: async (): Promise<AxiosResponse<Service[]>> => {
			return axiosInstance.get('/services')
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
				serviceName: string,
				data: ApiKeyCreate,
			): Promise<AxiosResponse<{ apiKey: string }>> => {
				return axiosInstance.post(`/services/${serviceName}/keys`, data)
			},
			get: async (
				serviceName: string,
				id: string,
			): Promise<AxiosResponse<{ id: string; key: string }>> => {
				return axiosInstance.get(`/services/${serviceName}/keys/${id}`)
			},
			list: async (serviceName: string): Promise<AxiosResponse<ApiKey[]>> => {
				return axiosInstance.get(`/services/${serviceName}/keys`)
			},
		},
		hooks: {
			create: async (
				serviceName: string,
				data: HookCreate,
			): Promise<AxiosResponse<{ id: string }>> => {
				return axiosInstance.post(`/services/${serviceName}/hooks`, data)
			},
			get: async (
				serviceName: string,
				id: string,
			): Promise<AxiosResponse<Hook>> => {
				return axiosInstance.get(`/services/${serviceName}/hooks/${id}`)
			},
			list: async (serviceName: string): Promise<AxiosResponse<Hook[]>> => {
				return axiosInstance.get(`/services/${serviceName}/hooks`)
			},
		},
	}
}
