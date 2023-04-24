export interface HookCreate {
	name: string
	description?: string
	url: string
	event_types: string[]
	secret?: string
}

export interface Hook extends HookCreate {
	id: string
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	service: string
	headers: Record<string, any>
	created_at: string
}
