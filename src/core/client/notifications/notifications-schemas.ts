import { z } from 'zod'
import { invoiceSchema } from '../invoices'
import { webhookDeliverySchema, webhookSchema } from '../webhooks'

export const notificationTypeSchema = z.enum([
	'INVOICE_PAID',
	'INVOICE_EXPIRED',
	'INVOICE_ERROR',
	'WEBHOOK_FAILURE',
])

export const notificationInvoiceDataSchema = z.object({
	id: invoiceSchema.shape.id,
	title: invoiceSchema.shape.title,
	description: invoiceSchema.shape.description,
	status: invoiceSchema.shape.status,
	price: invoiceSchema.shape.price,
	currency: invoiceSchema.shape.currency,
})

export const notificationWebhookDataSchema = z.object({
	id: webhookSchema.shape.id,
	url: webhookSchema.shape.url,
	name: webhookSchema.shape.name,
	description: webhookSchema.shape.description,
	delivery: z.object({
		id: webhookDeliverySchema.shape.id,
		type: webhookDeliverySchema.shape.type,
		success: webhookDeliverySchema.shape.success,
		status_code: webhookDeliverySchema.shape.status_code,
		redelivery: webhookDeliverySchema.shape.redelivery,
	}),
})

export const notificationBaseSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.string(),
	read: z.boolean(),
	archived: z.boolean(),
	service: z.object({
		id: z.string().uuid(),
		slug: z.string(),
		name: z.string(),
	}),
})

export const notificationInvoiceSchema = notificationBaseSchema.extend({
	type: z.enum(['INVOICE_PAID', 'INVOICE_EXPIRED', 'INVOICE_ERROR']),
	data: notificationInvoiceDataSchema,
})

export const notificationWebhookSchema = notificationBaseSchema.extend({
	type: z.enum(['WEBHOOK_FAILURE']),
	data: notificationWebhookDataSchema,
})

export const notificationSchema = notificationWebhookSchema.or(
	notificationInvoiceSchema,
)

export const notificationsOptionsSchema = z.object({
	limit: z.number().min(1).max(20).optional().nullable(),
	offset: z.number().min(0).optional().nullable(),
	order: z.enum(['asc', 'desc']).optional().nullable(),
})
