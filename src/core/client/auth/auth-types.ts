import { z } from 'zod'
import { signWithEmailAndPasswordSchema, verifyOtpSchema } from './auth-schemas'

export type SignEmailAndPassword = z.infer<
	typeof signWithEmailAndPasswordSchema
>

export type VerifyOtp = z.infer<typeof verifyOtpSchema>
