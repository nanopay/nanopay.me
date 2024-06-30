import { z } from 'zod'

export const apiKeyCreateSchema = z.object({
	name: z
		.string()
		.min(2)
		.max(40)
		.regex(/^[a-zA-Z0-9-.]+$/),
	description: z.string().max(512).nullable().optional(),
	scopes: z.array(z.string()),
})

export const apiKeySchema = z.object({
	id: z.number(),
	service_id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	checksum: z.string(),
	created_at: z.string(),
	scopes: z.array(z.string()),
})
