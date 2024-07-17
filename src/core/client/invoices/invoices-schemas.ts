import { INVOICE_MINIMUM_PRICE } from '@/core/constants'
import { z } from 'zod'
import { publicServiceSchema } from '../services/services-schema'

export const invoiceCreateSchema = z
	.object({
		title: z.string().min(2).max(40),
		description: z.string().max(512).nullable().optional(),
		price: z.number().min(INVOICE_MINIMUM_PRICE).max(1000000),
		recipient_address: z
			.string()
			.regex(/^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$/),
		metadata: z.object({}).nullable().optional(),
		redirect_url: z.string().url().max(512).nullable().optional(),
	})
	.strict()

export const invoiceStatusSchema = z.enum([
	'pending',
	'paid',
	'expired',
	'error',
])

export const paymentSchema = z.object({
	id: z.string(),
	from: z.string(),
	to: z.string(),
	hash: z.string(),
	amount: z.number(),
	timestamp: z.number(),
})

export const invoiceSchema = z.object({
	id: z.string(),
	title: z.string().min(2).max(40),
	description: z.string().max(512).nullable(),
	price: z.number().min(INVOICE_MINIMUM_PRICE).max(1000000),
	recipient_address: z
		.string()
		.regex(/^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$/),
	metadata: z.object({}).nullable(),
	redirect_url: z.string().url().max(512).nullable(),
	currency: z.string(),
	status: invoiceStatusSchema,
	expires_at: z.string(),
	created_at: z.string(),
	pay_address: z.string(),
	received_amount: z.number(),
	refunded_amount: z.number(),
	payments: z.array(paymentSchema),
})

export const invoicePublicSchema = invoiceSchema
	.omit({ metadata: true, recipient_address: true, redirect_url: true })
	.extend({
		has_redirect_url: z.boolean(),
		service: publicServiceSchema,
	})

export const invoicePaginationSchema = z.object({
	limit: z.number().min(1).max(20).optional(),
	offset: z.number().min(0).optional(),
	order: z.enum(['asc', 'desc']).optional(),
	order_by: z.enum(['name', 'created_at']).optional(),
})
