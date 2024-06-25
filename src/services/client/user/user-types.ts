import { z } from 'zod'
import { userCreateSchema, userSchema, userUpdateSchema } from './user-schema'

export type User = z.infer<typeof userSchema>

export type UserCreate = z.infer<typeof userCreateSchema>

export type UserUpdate = z.infer<typeof userUpdateSchema>
