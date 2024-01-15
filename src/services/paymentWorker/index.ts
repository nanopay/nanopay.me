import Fetcher from '@/lib/fetcher'
import { InvoiceCreate } from '@/types/invoice'

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

const paymentWorker = {
	client: fetcher,
	getErrorMessage: (error: any): string => {
		return error.message
	},
	invoices: {
		create: async (
			data: CreateInvoiceRequest,
		): Promise<CreateInvoiceResponse> => {
			// Ask Payment Worker to watch for payments
			return fetcher.post('/', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.PAYMENT_WORKER_AUTH_TOKEN!}`,
				},
			})
		},
	},
}

export default paymentWorker
