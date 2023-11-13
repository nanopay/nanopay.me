import Fetcher, { FetcherOptions } from '@/lib/fetcher'
import s3 from '@/services/s3'
import { Hook, HookCreate, HookDelivery, HookUpdate } from '@/types/hooks'
import { ApiKey, ApiKeyCreate, Service, ServiceCreate } from '@/types/services'
import { concatURL } from '@/utils/helpers'

export const services = (fetcher: Fetcher) => {
	return {
		create: async (
			data: ServiceCreate,
			options?: FetcherOptions,
		): Promise<{ id: string }> => {
			return fetcher.post('/services', data, options)
		},
		get: async (
			serviceName: string,
			options?: FetcherOptions,
		): Promise<Service> => {
			return fetcher.get(`/services/${serviceName}`, null, options)
		},
		list: async (options?: FetcherOptions): Promise<Service[]> => {
			return fetcher.get('/services', null, options)
		},
		upload: {
			avatar: async (
				file: File,
				progressCallback?: (progress: number) => void,
			): Promise<string> => {
				if (file.size > 1024 * 1024 * 5) {
					throw new Error('File size must be less than 5MB')
				}
				const { url, fields } = await fetcher.post('/upload/image')

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
				options?: FetcherOptions,
			): Promise<{ apiKey: string }> => {
				return fetcher.post(`/services/${serviceName}/keys`, data, options)
			},
			get: async (
				keyId: string,
				options?: FetcherOptions,
			): Promise<{ id: string; key: string }> => {
				return fetcher.get(`/keys/${keyId}`, null, options)
			},
			list: async (
				serviceName: string,
				options?: FetcherOptions,
			): Promise<ApiKey[]> => {
				return fetcher.get(`/services/${serviceName}/keys`, null, options)
			},
		},
		hooks: {
			create: async (
				serviceName: string,
				data: HookCreate,
				options?: FetcherOptions,
			): Promise<{ id: string }> => {
				return fetcher.post(`/services/${serviceName}/hooks`, data, options)
			},
			get: async (id: string, options?: FetcherOptions): Promise<Hook> => {
				return fetcher.get(`/hooks/${id}`, null, options)
			},
			list: async (
				serviceName: string,
				options?: FetcherOptions,
			): Promise<Hook[]> => {
				return fetcher.get(`/services/${serviceName}/hooks`, null, options)
			},
			update: async (
				hookId: string,
				data: HookUpdate,
				options?: FetcherOptions,
			): Promise<void> => {
				return fetcher.put(`/hooks/${hookId}`, data, options)
			},
			deliveries: {
				list: async (
					hookId: string,
					options?: FetcherOptions,
				): Promise<HookDelivery[]> => {
					return fetcher.get(`/hooks/${hookId}/deliveries`, null, options)
				},
			},
		},
	}
}
