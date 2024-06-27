import { z } from 'zod'
import { signWithEmailAndPasswordSchema } from './auth-schemas'

export type SignEmailAndPassword = z.infer<
	typeof signWithEmailAndPasswordSchema
>
