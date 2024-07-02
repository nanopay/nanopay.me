import { z } from 'zod'

export const signWithEmailAndPasswordSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export const verifyOtpSchema = z.object({
	email: z.string().email(),
	token: z.string().length(6),
})
