import { z } from 'zod'

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 64
const MAX_URL_LENGTH = 256
const MAX_EMAIL_LENGTH = 128

export const userNameSchema = z
	.string()
	.min(MIN_NAME_LENGTH)
	.max(MAX_NAME_LENGTH)

export const userSchema = z.object({
	id: z.string().uuid(),
	name: userNameSchema,
	avatar_url: z.string().url().max(MAX_URL_LENGTH).nullable(),
	email: z.string().email().max(MAX_EMAIL_LENGTH),
	created_at: z.string(),
})

export const userCreateSchema = z.object({
	name: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
	avatar_url: z.string().url().max(MAX_URL_LENGTH).nullable(),
})

export const userUpdateSchema = userCreateSchema.partial()
