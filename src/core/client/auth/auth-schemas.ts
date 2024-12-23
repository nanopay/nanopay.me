import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/core/constants'
import { z } from 'zod'

export const passwordSchema = z
	.string()
	.min(MIN_PASSWORD_LENGTH)
	.max(MAX_PASSWORD_LENGTH)

export const signWithEmailAndPasswordSchema = z.object({
	email: z.string().email(),
	password: passwordSchema,
})

export const verifyOtpSchema = z.object({
	email: z.string().email(),
	token: z.string().length(6),
	type: z.enum(['recovery', 'signup']),
})
