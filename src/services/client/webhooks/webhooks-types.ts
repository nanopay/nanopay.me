import { z } from 'zod'
import {
	webhookCreateSchema,
	webhookDeliverySchema,
	webhookEventTypeSchema,
	webhookSchema,
	webhookUpdateSchema,
} from './webhooks-schemas'

export type Webhook = z.infer<typeof webhookSchema>

export type WebhookCreate = z.infer<typeof webhookCreateSchema>

export type WebhookUpdate = z.infer<typeof webhookUpdateSchema>

export type WebhookEventType = z.infer<typeof webhookEventTypeSchema>

export type WebhookDelivery = z.infer<typeof webhookDeliverySchema>
