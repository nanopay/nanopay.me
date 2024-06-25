import { z } from 'zod'

export const apiKeyCreateSchema = z.object({
	service_id: z.string().uuid(),
	name: z
		.string()
		.min(2)
		.max(40)
		.regex(/^[a-zA-Z0-9-.]+$/),
	description: z.string().max(512).nullable().optional(),
	scopes: z.array(z.string()),
})

export const apiKeyInsertSchema = apiKeyCreateSchema.extend({
	checksum: z.string(),
})
