import { Invoice, InvoiceCreate } from '@/types/invoice'
import { Payment } from '@/types/payment'
import { AxiosInstance, AxiosResponse } from 'axios'

export const invoices = (axiosInstance: AxiosInstance) => {
	return {
		create: async (
			serviceId: string,
			data: InvoiceCreate,
		): Promise<AxiosResponse<{ id: string }>> => {
			return axiosInstance.post(`/invoices?service_id=${serviceId}`, data)
		},
		get: async (invoiceId: string): Promise<AxiosResponse<Invoice>> => {
			return axiosInstance.get(`/invoices/${invoiceId}`)
		},
		list: async (serviceId: string): Promise<AxiosResponse<Invoice[]>> => {
			return axiosInstance.get(`/invoices?service_id=${serviceId}`)
		},
		payments: async (invoiceId: string): Promise<AxiosResponse<Payment[]>> => {
			return axiosInstance.get(`/invoices/${invoiceId}/payments`)
		},
	}
}
