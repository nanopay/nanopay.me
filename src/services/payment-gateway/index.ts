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
	url: string

	constructor() {
		this.url = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL!
		if (!URL.canParse(this.url)) {
			throw new Error('NEXT_PUBLIC_PAYMENT_GATEWAY_URL must be a valid URL')
		}
		this.client = new Fetcher(this.url)
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

	buildPaymentsWebsocketUrl = (invoiceId: string) => {
		const url = new URL(
			this.url.replace('ws://', 'http://').replace('wss://', 'https://'),
		)
		url.pathname = `/invoices/${invoiceId}/payments`
		return url.toString()
	}
}

export const paymentGateway = new PaymentGateway()
