import {
	MAX_EMAIL_LENGTH,
	MAX_URL_LENGTH,
	MAX_USER_NAME_LENGTH,
	MIN_USER_NAME_LENGTH,
} from '@/core/constants'
import { z } from 'zod'

export const userNameSchema = z
	.string()
	.min(MIN_USER_NAME_LENGTH)
	.max(MAX_USER_NAME_LENGTH)

export const avatarUrlSchema = z.string().url().max(MAX_URL_LENGTH).nullable()

export const userSchema = z.object({
	id: z.string().uuid(),
	name: userNameSchema,
	avatar_url: avatarUrlSchema,
	email: z.string().email().max(MAX_EMAIL_LENGTH),
	created_at: z.string(),
})

export const userCreateSchema = z.object({
	name: userNameSchema,
	avatar_url: avatarUrlSchema.optional(),
})

export const userUpdateSchema = userCreateSchema.partial()
