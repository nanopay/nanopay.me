import { z } from 'zod'
import {
	invoiceCreateSchema,
	invoicePaginationSchema,
	invoiceSchema,
	invoicePublicSchema,
	paymentSchema,
} from './invoices-schemas'

export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>

export type Payment = z.infer<typeof paymentSchema>

export type Invoice = z.infer<typeof invoiceSchema>

export type InvoicePublic = z.infer<typeof invoicePublicSchema>

export type InvoiceStatus = z.infer<typeof invoiceSchema>['status']

export type InvoicePagination = z.infer<typeof invoicePaginationSchema>
