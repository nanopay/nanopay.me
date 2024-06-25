import { z } from 'zod'
import { apiKeyCreateSchema, apiKeySchema } from './api-keys-schemas'

export type ApiKey = z.infer<typeof apiKeySchema>

export type ApiKeyCreate = z.infer<typeof apiKeyCreateSchema>
