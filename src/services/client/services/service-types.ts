import { z } from 'zod'
import {
	serviceCreateSchema,
	servicePaginationSchema,
	serviceSchema,
	serviceUpdateSchema,
} from './services-schema'

export type Service = z.infer<typeof serviceSchema>

export type ServiceCreate = z.infer<typeof serviceCreateSchema>

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>

export type ServicePagination = z.infer<typeof servicePaginationSchema>
