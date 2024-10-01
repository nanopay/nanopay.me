import { z } from 'zod'
import { invoicePublicSchema } from '../invoices'
import { MIN_SPONSOR_AMOUNT } from '@/core/constants'

export const sponsorCreateSchema = z.object({
	name: z.string().min(2, { message: 'Name is required' }),
	avatar_url: z.string().url().optional().nullable(),
	message: z.string().max(300).optional().nullable(),
	amount: z.number().min(MIN_SPONSOR_AMOUNT).max(1000000),
})

export const sponsorshipSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2, { message: 'Name is required' }),
	avatar_url: z.string().url().nullable(),
	message: z.string().max(300).nullable(),
	amount: z.number().min(MIN_SPONSOR_AMOUNT).max(1000000),
	created_at: z.string().datetime(),
	invoice: invoicePublicSchema,
})
