import { Service } from './services'

export type InvoiceStatus =
	| 'pending'
	| 'processing'
	| 'paid'
	| 'expired'
	| 'refunded'
	| 'canceled'
	| 'error'
	| 'paid_partial'
	| 'refunded_partial'

export interface InvoiceCreate {
	title: string
	description?: string
	price: number
	recipient_address: string
	metadata?: Record<string, any>
	redirect_url?: string
}

export interface Invoice extends InvoiceCreate {
	id: string
	currency: string
	status: InvoiceStatus
	expires_at: string
	created_at: string
	pay_address: string
	received_amount: number
	refunded_amount: number
	service: Omit<Service, 'api_keys_count'>
}
