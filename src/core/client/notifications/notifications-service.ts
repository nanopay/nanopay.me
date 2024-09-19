import { BaseService } from '../base-service'
import {
	Notification,
	NotificationInvoiceData,
	NotificationWebhookData,
} from './notifications-types'

export class NotificationsService extends BaseService {
	async list(
		serviceIdOrSlug: string,
		page = 1,
		pageSize = 10,
	): Promise<Notification[]> {
		const offset = (page - 1) * pageSize

		const serviceId = await this.getIdFromServiceIdOrSlug(serviceIdOrSlug)

		const { data, error } = await this.supabase
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
               status,
               price,
               currency,
               description
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
			)
			.eq('service_id', serviceId)
			.order('created_at', { ascending: false })
			.range(offset, offset + pageSize - 1)

		if (error) {
			throw new Error(error.message)
		}

		return data.map(notification => {
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
					status: event.invoice.status,
					price: event.invoice.price,
					currency: event.invoice.currency,
					description: event.invoice.description,
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
	}
}
