import { z } from 'zod'
import {
	notificationInvoiceDataSchema,
	notificationInvoiceSchema,
	notificationsOptionsSchema,
	notificationSchema,
	notificationTypeSchema,
	notificationWebhookDataSchema,
	notificationWebhookSchema,
} from './notifications-schemas'

export type NotificationType = z.infer<typeof notificationTypeSchema>

export type NotificationInvoiceData = z.infer<
	typeof notificationInvoiceDataSchema
>

export type NotificationWebhookData = z.infer<
	typeof notificationWebhookDataSchema
>

export type NotificationInvoice = z.infer<typeof notificationInvoiceSchema>

export type NotificationWebhook = z.infer<typeof notificationWebhookSchema>

export type Notification = z.infer<typeof notificationSchema>

export type NotificationsOptions = z.infer<typeof notificationsOptionsSchema>
