import { paymentGateway } from '@/services/payment-gateway'
import { BaseService } from '../base-service'
import {
	invoiceCreateSchema,
	invoicePaginationSchema,
	invoicePublicSchema,
	invoiceSchema,
} from './invoices-schemas'
import {
	Invoice,
	InvoiceCreate,
	InvoicePagination,
	InvoiceStatus,
	InvoicePublic,
} from './invoices-types'
import { checkUUID } from '@/core/utils'
import { z } from 'zod'
import { DEFAULT_INVOICES_PAGINATION_LIMIT } from '@/core/constants'

export class InvoicesService extends BaseService {
	async create(
		serviceIdOrSlug: string,
		data: InvoiceCreate,
	): Promise<{
		id: string
		pay_address: string
		expires_at: string
	}> {
		invoiceCreateSchema.parse(data)

		const serviceId = await this.getIdFromServiceIdOrSlug(serviceIdOrSlug)

		try {
			const { id, pay_address, expires_at } =
				await paymentGateway.createInvoice({
					service_id: serviceId,
					...data,
				})

			return {
				id,
				pay_address,
				expires_at,
			}
		} catch (error) {
			const message = paymentGateway.getErrorMessage(error)
			throw new Error(`Failed to queue payment worker: ${message}`)
		}
	}

	async get(invoiceId: string, serviceId?: string): Promise<Invoice | null> {
		const query = this.supabase
			.from('invoices')
			.select('*, payments(id, from, to, hash, amount, timestamp)')
			.eq('id', invoiceId)

		if (serviceId) {
			query.eq('service_id', serviceId)
		}

		const { data: invoice, error } = await query.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}
			throw new Error(error.message)
		}

		return {
			id: invoice.id,
			title: invoice.title,
			description: invoice.description,
			price: invoice.price,
			recipient_address: invoice.recipient_address,
			metadata: invoice.metadata,
			redirect_url: invoice.redirect_url,
			currency: invoice.currency,
			status: invoice.status as InvoiceStatus,
			created_at: invoice.created_at,
			expires_at: invoice.expires_at,
			pay_address: invoice.pay_address as string,
			received_amount: invoice.received_amount,
			refunded_amount: invoice.refunded_amount,
			payments: invoice.payments,
		}
	}

	async getPublicInvoice(invoiceId: string): Promise<InvoicePublic | null> {
		const { data, error } = await this.supabase
			.from('invoices')
			.select(
				'*, service:services(id, slug, name, avatar_url, website, contact_email), payments(id, from, to, hash, amount, timestamp)',
			)
			.eq('id', invoiceId)
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}
			throw new Error(error.message)
		}

		if (!data.service) {
			throw new Error('Service not found')
		}

		const invoice = {
			id: data.id,
			title: data.title,
			description: data.description,
			price: data.price,
			currency: data.currency,
			status: data.status as InvoiceStatus,
			created_at: data.created_at,
			expires_at: data.expires_at,
			pay_address: data.pay_address as string,
			has_redirect_url: !!data.redirect_url,
			received_amount: data.received_amount,
			refunded_amount: data.refunded_amount,
			service: data.service,
			payments: data.payments,
		}

		return invoicePublicSchema.parse(invoice)
	}

	async list(
		serviceIdOrSlug: string,
		options?: InvoicePagination,
	): Promise<{
		invoices: Invoice[]
		count: number
	}> {
		if (options) {
			invoicePaginationSchema.parse(options)
		}

		const query = this.supabase
			.from('invoices')
			.select(
				'*, service:services!inner(name), payments(id, from, to, hash, amount, timestamp)',
				{ count: 'exact' },
			)

		if (checkUUID(serviceIdOrSlug)) {
			query.eq('service_id', serviceIdOrSlug)
		} else {
			query.eq('service.slug', serviceIdOrSlug)
		}

		const offset = options?.offset || 0
		const limit = options?.limit || DEFAULT_INVOICES_PAGINATION_LIMIT
		const order = options?.order || 'desc'

		const { data, count, error } = await query
			.range(offset, offset + limit - 1)
			.order('created_at', {
				ascending: order === 'asc',
			})

		if (error) {
			throw new Error(error.message)
		}

		const invoices = data.map(invoice => ({
			id: invoice.id,
			title: invoice.title,
			description: invoice.description,
			price: invoice.price,
			recipient_address: invoice.recipient_address,
			metadata: invoice.metadata,
			redirect_url: invoice.redirect_url,
			currency: invoice.currency,
			status: invoice.status as InvoiceStatus,
			created_at: invoice.created_at,
			expires_at: invoice.expires_at,
			pay_address: invoice.pay_address as string,
			received_amount: invoice.received_amount,
			refunded_amount: invoice.refunded_amount,
			payments: invoice.payments,
		}))

		return {
			invoices: z.array(invoiceSchema).parse(invoices),
			count: z.number().parse(count),
		}
	}
}
