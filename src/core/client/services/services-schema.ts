import {
	MAX_SERVICE_NAME_LENGTH,
	MAX_URL_LENGTH,
	MIN_SERVICE_NAME_LENGTH,
} from '@/core/constants'
import { z } from 'zod'

export const serviceNameSchema = z
	.string()
	.min(MIN_SERVICE_NAME_LENGTH, {
		message: `Name must contain at least ${MIN_SERVICE_NAME_LENGTH} character(s)`,
	})
	.max(MAX_SERVICE_NAME_LENGTH, {
		message: `Name must contain at most ${MAX_SERVICE_NAME_LENGTH} character(s)`,
	})

export const serviceIdSchema = z.string().uuid()

export const serviceNameOrIdSchema = z.union([
	serviceNameSchema,
	serviceIdSchema,
])

export const serviceWebsiteSchema = z
	.string()
	.url()
	.max(MAX_URL_LENGTH)
	.nullable()

export const serviceAvatarUrlSchema = z
	.string()
	.url()
	.max(MAX_URL_LENGTH)
	.nullable()

export const serviceContactEmailSchema = z.string().email().nullable()

export const serviceCreateSchema = z.object({
	name: z.string().min(MIN_SERVICE_NAME_LENGTH).max(MAX_SERVICE_NAME_LENGTH),
	avatar_url: serviceAvatarUrlSchema.optional(),
	website: serviceWebsiteSchema.optional(),
	contact_email: serviceContactEmailSchema.optional(),
})

export const serviceUpdateSchema = z.object({
	slug: serviceNameSchema.optional(),
	name: serviceNameSchema.max(MAX_SERVICE_NAME_LENGTH).optional(),
	avatar_url: serviceAvatarUrlSchema.optional(),
	website: serviceWebsiteSchema.optional(),
	contact_email: serviceContactEmailSchema.optional(),
})

export const publicServiceSchema = z.object({
	id: serviceIdSchema,
	slug: serviceNameSchema,
	name: serviceNameSchema,
	avatar_url: serviceAvatarUrlSchema,
	website: serviceWebsiteSchema,
	contact_email: serviceContactEmailSchema,
})

export const serviceSchema = z.object({
	id: serviceIdSchema,
	slug: serviceNameSchema,
	name: serviceNameSchema,
	avatar_url: serviceAvatarUrlSchema,
	user_id: z.string().uuid(),
	website: serviceWebsiteSchema,
	contact_email: serviceContactEmailSchema,
	invoices_count: z.number().min(0),
	api_keys_count: z.number().min(0),
	webhooks_count: z.number().min(0),
	created_at: z.string(),
})

export const servicePaginationSchema = z.object({
	limit: z.number().min(1).max(20).optional(),
	offset: z.number().min(0).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	order_by: z.enum(['name', 'created_at']).optional(),
})
