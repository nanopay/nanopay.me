import { z } from 'zod'

const MIN_SERVICE_NAME_LENGTH = 3
const MAX_SERVICE_NAME_LENGTH = 40
const MAX_DESCRIPTION_LENGTH = 256
const MAX_URL_LENGTH = 256

export const serviceNameSchema = z
	.string()
	.min(MIN_SERVICE_NAME_LENGTH)
	.max(MAX_SERVICE_NAME_LENGTH)

export const serviceAvatarUrlSchema = z
	.string()
	.url()
	.max(MAX_URL_LENGTH)
	.nullable()

export const serviceDescriptionSchema = z
	.string()
	.max(MAX_DESCRIPTION_LENGTH)
	.nullable()

export const serviceCreateSchema = z.object({
	name: z.string().min(MIN_SERVICE_NAME_LENGTH).max(MAX_SERVICE_NAME_LENGTH),
	avatar_url: serviceAvatarUrlSchema.optional(),
	description: serviceDescriptionSchema.optional(),
	website: z.string().url().max(MAX_URL_LENGTH).nullable().optional(),
	contact_email: z.string().email().nullable().optional(),
})

export const serviceUpdateSchema = z.object({
	name: serviceNameSchema.optional(),
	display_name: serviceNameSchema.max(MAX_SERVICE_NAME_LENGTH).optional(),
	avatar_url: serviceAvatarUrlSchema.optional(),
	description: serviceDescriptionSchema.optional(),
	website: z.string().url().max(MAX_URL_LENGTH).nullable().optional(),
	contact_email: z.string().email().nullable().optional(),
})

export const publicServiceSchema = z.object({
	id: z.string().uuid(),
	name: serviceNameSchema,
	display_name: serviceNameSchema,
	avatar_url: serviceAvatarUrlSchema,
	description: serviceDescriptionSchema.nullable(),
	website: z.string().url().max(MAX_URL_LENGTH).nullable(),
	contact_email: z.string().email().nullable(),
})

export const serviceSchema = z.object({
	id: z.string().uuid(),
	name: serviceNameSchema,
	avatar_url: serviceAvatarUrlSchema,
	description: serviceDescriptionSchema.nullable(),
	user_id: z.string().uuid(),
	display_name: serviceNameSchema,
	website: z.string().url().max(MAX_URL_LENGTH).nullable(),
	contact_email: z.string().email().nullable(),
	invoices_count: z.number().min(0),
	api_keys_count: z.number().min(0),
	hooks_count: z.number().min(0),
	created_at: z.string(),
})

export const servicePaginationSchema = z.object({
	limit: z.number().min(1).max(20).optional(),
	offset: z.number().min(0).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	order_by: z.enum(['name', 'created_at']).optional(),
})
