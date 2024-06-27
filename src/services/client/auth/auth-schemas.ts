import { z } from 'zod'

export const signWithEmailAndPasswordSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})
