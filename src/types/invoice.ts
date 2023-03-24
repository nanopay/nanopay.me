import { Project } from './projects'

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
	project: Omit<Project, 'api_keys_count'>
}
