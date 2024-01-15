import Fetcher, { FetcherOptions } from '@/lib/fetcher'
import { Invoice, InvoiceCreate } from '@/types/invoice'
import { Payment } from '@/types/payment'

export const invoices = (fetcher: Fetcher) => {
	return {
		create: async (
			serviceName: string,
			data: InvoiceCreate,
			options?: FetcherOptions,
		): Promise<{ id: string }> => {
			return fetcher.post(`/services/${serviceName}/invoices`, data, options)
		},
		get: async (
			invoiceId: string,
			options?: FetcherOptions,
		): Promise<Invoice> => {
			return fetcher.get(`/invoices/${invoiceId}`, null, options)
		},
		list: async (
			serviceName: string,
			options?: FetcherOptions,
		): Promise<Invoice[]> => {
			return fetcher.get(`/services/${serviceName}/invoices`, null, options)
		},
		payments: async (
			invoiceId: string,
			options?: FetcherOptions,
		): Promise<Payment[]> => {
			return fetcher.get(`/invoices/${invoiceId}/payments`, null, options)
		},
	}
}
