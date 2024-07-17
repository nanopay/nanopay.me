import { z } from 'zod'

export const webhookEventTypeSchema = z.enum([
	'invoice.paid',
	'invoice.created',
	'invoice.error',
	'invoice.expired',
])

export const webhookSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string().nullable(),
	url: z.string().url(),
	event_types: z.array(webhookEventTypeSchema),
	active: z.boolean(),
	secret: z.string().nullable(),
	created_at: z.string(),
})

export const webhookCreateSchema = z.object({
	name: z.string(),
	description: z.string().nullable().optional(),
	url: z.string().url(),
	event_types: z.array(webhookEventTypeSchema),
	secret: z.string().nullable().optional(),
})

export const webhookUpdateSchema = webhookCreateSchema.partial()

export const webhookDeliverySchema = z.object({
	id: z.string().uuid(),
	webhook_id: z.string().uuid(),
	type: webhookEventTypeSchema,
	created_at: z.string(),
	started_at: z.string(),
	completed_at: z.string(),
	url: z.string().url(),
	status_code: z.number(),
	redelivery: z.boolean(),
	request_body: z.object({}),
	success: z.boolean(),
	request_headers: z.object({}),
	response_headers: z.object({}),
	response_body: z.string().nullable(),
})
