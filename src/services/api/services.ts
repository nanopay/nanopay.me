import Fetcher, { FetcherOptions } from '@/lib/fetcher'
import { Hook, HookCreate, HookDelivery, HookUpdate } from '@/types/hooks'
import { ApiKey, ApiKeyCreate, Service } from '@/types/services'

export const services = (fetcher: Fetcher) => {
	return {
		get: async (
			serviceName: string,
			options?: FetcherOptions,
		): Promise<Service> => {
			return fetcher.get(`/services/${serviceName}`, null, options)
		},
		list: async (
			{
				limit,
				offset,
				order,
				order_by,
			}: {
				limit?: number
				offset?: number
				order?: 'asc' | 'desc'
				order_by?: 'name' | 'created_at'
			},
			options?: FetcherOptions,
		): Promise<Service[]> => {
			const searchParams = new URLSearchParams()
			if (limit) searchParams.set('limit', limit.toString())
			if (offset) searchParams.set('offset', offset.toString())
			if (order) searchParams.set('order', order)
			if (order_by) searchParams.set('order_by', order_by)
			return fetcher.get(`/services?${searchParams.toString()}`, null, options)
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
