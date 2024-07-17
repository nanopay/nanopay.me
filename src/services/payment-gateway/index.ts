import Fetcher from '@/lib/fetcher'
import { InvoiceCreate } from '@/core/client/invoices/invoices-types'

export interface CreateInvoiceRequest extends InvoiceCreate {
	service_id: string
}

export interface CreateInvoiceResponse {
	id: string
	pay_address: string
	expires_at: string
}

class PaymentGateway {
	client: Fetcher

	constructor() {
		this.client = new Fetcher(process.env.PAYMENT_GATEWAY_URL!)
	}

	getErrorMessage(error: any): string {
		return error.message
	}

	createInvoice = async (
		data: CreateInvoiceRequest,
	): Promise<CreateInvoiceResponse> => {
		// Ask Payment Worker to watch for payments
		return this.client.post('/invoices', data, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.PAYMENT_GATEWAY_AUTH_TOKEN!}`,
			},
		})
	}
}

export const paymentGateway = new PaymentGateway()
