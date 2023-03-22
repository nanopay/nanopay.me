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
	status: string
	expires_at: string
	created_at: string
	pay_address: string
	received_amount: number
	refunded_amount: number
	project_id: string
}
