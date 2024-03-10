import { Invoice } from './invoice'
import { Payment } from './payment'
import { Service } from './services'
export interface HookCreate {
	name: string
	description?: string
	url: string
	event_types: string[]
	secret?: string
}

export interface HookUpdate extends HookCreate {}

export interface Hook extends HookCreate {
	id: string
	service: string
	active: boolean
	created_at: string
}

export interface HookDelivery {
	id: string
	hook_id: string
	type: string
	url: string
	success: boolean
	status_code: number
	started_at: string
	completed_at: string
	request_headers: Record<string, string>
	response_headers: Record<string, string>
	response_body: string | null
	redelivery: boolean
	request_body: {
		invoice: Invoice
		payment: Payment
		service: Service | null
	}
}
