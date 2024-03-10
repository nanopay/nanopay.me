import Fetcher, { FetcherOptions } from '@/lib/fetcher'
import { InvoiceCreate, InvoiceStatus } from '@/types/invoice'
import { PublicService } from '@/types/services'

const fetcher = new Fetcher(process.env.PAYMENT_WORKER_URL!)

export interface CreateUserInvoiceRequest extends InvoiceCreate {
	user_id: string | null
}

export interface CreateServiceInvoiceRequest extends InvoiceCreate {
	service_id: string
}

export type CreateInvoiceRequest =
	| CreateUserInvoiceRequest
	| CreateServiceInvoiceRequest

export interface CreateInvoiceResponse {
	id: string
	pay_address: string
	expires_at: string
}

export type FullInvoiceWithService = {
	id: string
	title: string
	index: number
	status: InvoiceStatus
	currency: string
	description: string | null
	expires_at: string
	metadata: Record<string, any> | null
	pay_address: string
	price: number
	received_amount: number
	recipient_address: string
	redirect_url: string | null
	refunded_amount: number
	created_at: string
	service: PublicService
}

const paymentGateway = {
	client: fetcher,
	getErrorMessage: (error: any): string => {
		return error.message
	},
	invoices: {
		get: async (
			id: string,
			options: FetcherOptions,
		): Promise<FullInvoiceWithService> => {
			return fetcher.get(`/invoices/${id}`, null, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.PAYMENT_WORKER_AUTH_TOKEN!}`,
					...options.headers,
				},
			})
		},
		create: async (
			data: CreateInvoiceRequest,
		): Promise<CreateInvoiceResponse> => {
			// Ask Payment Worker to watch for payments
			return fetcher.post('/invoices', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.PAYMENT_WORKER_AUTH_TOKEN!}`,
				},
			})
		},
	},
}

export default paymentGateway
