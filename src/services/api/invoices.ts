import { Invoice, InvoiceCreate } from '@/types/invoice'
import { AxiosInstance, AxiosResponse } from 'axios'

export const invoices = (axiosInstance: AxiosInstance) => {
	return {
		create: async (
			projectId: string,
			data: InvoiceCreate,
		): Promise<AxiosResponse<{ id: string }>> => {
			return axiosInstance.post(`/invoices?project_id=${projectId}`, data)
		},
		get: async (invoiceId: string): Promise<AxiosResponse<Invoice>> => {
			return axiosInstance.get(`/invoices/${invoiceId}`)
		},
		list: async (projectId: string): Promise<AxiosResponse<Invoice[]>> => {
			return axiosInstance.get(`/invoices?project_id=${projectId}`)
		},
	}
}
