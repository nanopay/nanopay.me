import { checkUUID } from '@/utils/helpers'
import { BaseService } from '../base-service'
import { webhookCreateSchema, webhookUpdateSchema } from './webhooks-schemas'
import {
	Webhook,
	WebhookCreate,
	WebhookDelivery,
	WebhookEventType,
	WebhookUpdate,
} from './webhooks-types'

export class WebhooksService extends BaseService {
	async create(
		serviceNameOrId: string,
		data: WebhookCreate,
	): Promise<{ id: string }> {
		webhookCreateSchema.parse(data)

		const serviceId = await this.getIdFromServiceNameOrId(serviceNameOrId)

		const { error, data: hook } = await this.supabase
			.from('hooks')
			.insert({
				name: data.name,
				description: data.description,
				url: data.url,
				event_types: data.event_types,
				secret: data.secret,
				service_id: serviceId,
			})
			.select('id')
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return hook
	}

	async get(webhookId: string): Promise<Webhook> {
		const { data, error } = await this.supabase
			.from('hooks')
			.select('*')
			.eq('id', webhookId)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return {
			id: data.id,
			name: data.name,
			description: data.description,
			url: data.url,
			event_types: data.event_types as WebhookEventType[],
			active: data.active,
			secret: data.secret,
			created_at: data.created_at,
		}
	}

	async list(serviceNameOrId: string): Promise<Webhook[]> {
		const query = this.supabase
			.from('hooks')
			.select('*, service:services(name)')

		if (checkUUID(serviceNameOrId)) {
			query.eq('service_id', serviceNameOrId)
		} else {
			query.eq('service.name', serviceNameOrId)
		}

		const { data, error } = await query

		if (error) {
			throw new Error(error.message)
		}

		return data.map(webhook => ({
			id: webhook.id,
			name: webhook.name,
			description: webhook.description,
			url: webhook.url,
			event_types: webhook.event_types as WebhookEventType[],
			active: webhook.active,
			secret: webhook.secret,
			created_at: webhook.created_at,
		}))
	}

	async update(webhookId: string, data: WebhookUpdate): Promise<void> {
		webhookUpdateSchema.parse(data)
		const { error } = await this.supabase
			.from('hooks')
			.update({
				name: data.name,
				description: data.description,
				url: data.url,
				event_types: data.event_types,
				secret: data.secret,
			})
			.eq('id', webhookId)
			.select('id')
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				throw new Error('nothing updated')
			}
			throw new Error(error.message)
		}
	}

	async delete(webhookId: string): Promise<void> {
		const { error } = await this.supabase
			.from('hooks')
			.delete()
			.eq('id', webhookId)
		if (error) {
			throw new Error(error.message)
		}
	}

	async deliveries(webhookId: string): Promise<WebhookDelivery[]> {
		const { data, error } = await this.supabase
			.from('webhook_deliveries')
			.select('*')
			.eq('webhook_id', webhookId)
			.order('created_at', { ascending: false })

		if (error) {
			throw new Error(error.message)
		}

		return data.map(delivery => ({
			id: delivery.id,
			hook_id: delivery.hook_id,
			type: delivery.type as WebhookEventType,
			created_at: delivery.created_at,
			started_at: delivery.started_at,
			completed_at: delivery.completed_at,
			url: delivery.url,
			status_code: delivery.status_code,
			redelivery: delivery.redelivery,
			request_body: delivery.request_body,
			success: delivery.success,
			request_headers: delivery.request_headers,
			response_headers: delivery.response_headers,
			response_body: delivery.response_body,
		}))
	}
}
