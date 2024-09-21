import { z } from 'zod'
import { BaseService } from '../base-service'
import {
	notificationsOptionsSchema,
	notificationSchema,
} from './notifications-schemas'
import {
	Notification,
	NotificationInvoiceData,
	NotificationsOptions,
	NotificationWebhookData,
} from './notifications-types'

export class NotificationsService extends BaseService {
	async list(
		serviceIdOrSlug: string,
		options: NotificationsOptions,
	): Promise<{
		notifications: Notification[]
		count: number
	}> {
		if (options) {
			notificationsOptionsSchema.parse(options)
		}

		const offset = options?.offset || 0
		const limit = options?.limit || 10
		const order = options?.order || 'desc'
		const status = options?.status || 'inbox'

		const serviceId = await this.getIdFromServiceIdOrSlug(serviceIdOrSlug)

		const { data, count, error } = await this.supabase
			.from('notifications')
			.select(
				`
            id,
            created_at,
            read,
            archived,
            service:services (
              id,
              slug,
              name
            ),
            event:notifications_events (
              type,
              invoice:invoices(
               id,
			   title,
			   description,
               status,
               price,
               currency
              ),
              webhook_delivery:webhooks_deliveries (
                id,
                type,
                success,
                status_code,
                redelivery,
                webhook:webhooks (
                  id,
                  url,
                  name,
                  description
                )
              )
            )
          `,
				{ count: 'exact' },
			)
			.eq('service_id', serviceId)
			.eq('archived', status === 'archived')
			.order('created_at', {
				ascending: order === 'asc',
			})
			.range(offset, offset + limit - 1)

		if (error) {
			throw new Error(error.message)
		}

		const notifications = data.map(notification => {
			const service = notification.service
			if (!service) {
				// Just for typescript, it cannot really be null
				throw new Error('Service not found')
			}
			const event = notification.event
			if (!event) {
				// Just for typescript, it cannot really be null
				throw new Error('Event not found')
			}

			let data: NotificationInvoiceData | NotificationWebhookData

			if (event.webhook_delivery?.webhook) {
				data = {
					id: event.webhook_delivery.webhook.id,
					url: event.webhook_delivery.webhook.url,
					name: event.webhook_delivery.webhook.name,
					description: event.webhook_delivery.webhook.description,
					delivery: {
						id: event.webhook_delivery.id,
						type: event.webhook_delivery
							.type as NotificationWebhookData['delivery']['type'],
						success: event.webhook_delivery.success,
						status_code: event.webhook_delivery.status_code,
						redelivery: event.webhook_delivery.redelivery,
					},
				}
			} else {
				if (!event.invoice) {
					throw new Error('Event not found')
				}
				data = {
					id: event.invoice.id,
					title: event.invoice.title,
					description: event.invoice.description,
					status: event.invoice.status,
					price: event.invoice.price,
					currency: event.invoice.currency,
				}
			}

			return {
				id: notification.id,
				createdAt: notification.created_at,
				read: notification.read,
				archived: notification.archived,
				service: {
					id: service.id,
					slug: service.slug,
					name: service.name,
				},
				type: event.type,
				data,
			} as Notification
		})

		return {
			notifications: notificationSchema.array().parse(notifications),
			count: z.number().parse(count),
		}
	}
}
