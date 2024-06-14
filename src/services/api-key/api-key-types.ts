import { z } from 'zod'
import { apiKeyCreateSchema, apiKeyInsertSchema } from './api-key-schema'

export type ApiKeyCreate = z.infer<typeof apiKeyCreateSchema>

export type ApiKeyInsert = z.infer<typeof apiKeyInsertSchema>
