import { paymentGateway } from '@/services/payment-gateway'
import { BaseService } from '../base-service'
import { invoiceCreateSchema, invoiceSchema } from './invoices-schemas'
import {
	Invoice,
	InvoiceCreate,
	InvoicePagination,
	InvoiceStatus,
	InvoicePublic,
} from './invoices-types'
import { checkUUID } from '@/utils/helpers'
import { z } from 'zod'
import { serviceNameSchema } from '../services/services-schema'

export class InvoicesService extends BaseService {
	async create(
		serviceNameOrId: string,
		data: InvoiceCreate,
	): Promise<{
		id: string
		pay_address: string
		expires_at: string
	}> {
		invoiceCreateSchema.parse(data)

		const query = this.supabase.from('services').select('id')

		if (checkUUID(serviceNameOrId)) {
			query.eq('id', serviceNameOrId)
		} else {
			serviceNameSchema.parse(serviceNameOrId)
			query.eq('name', serviceNameOrId)
		}

		const { data: serviceData, error } = await query.single()

		if (error) {
			throw new Error(error.message)
		}

		try {
			const { id, pay_address, expires_at } =
				await paymentGateway.createInvoice({
					service_id: serviceData.id,
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
			.select('*, payments:payments(id, from, to, hash, amount, timestamp)')
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
		const { data: invoice, error } = await this.supabase
			.from('invoices')
			.select(
				'*, service:services(id, name, display_name, avatar_url, description, website, contact_email), payments:payments(id, from, to, hash, amount, timestamp)',
			)
			.eq('id', invoiceId)
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return null
			}
			throw new Error(error.message)
		}

		if (!invoice.service) {
			throw new Error('Service not found')
		}

		return {
			id: invoice.id,
			title: invoice.title,
			description: invoice.description,
			price: invoice.price,
			currency: invoice.currency,
			status: invoice.status as InvoiceStatus,
			created_at: invoice.created_at,
			expires_at: invoice.expires_at,
			pay_address: invoice.pay_address as string,
			has_redirect_url: !!invoice.redirect_url,
			received_amount: invoice.received_amount,
			refunded_amount: invoice.refunded_amount,
			service: invoice.service,
			payments: invoice.payments,
		}
	}

	async list(
		serviceIdOrName: string,
		options?: InvoicePagination,
	): Promise<Invoice[]> {
		const query = this.supabase
			.from('invoices')
			.select('*, service:services(name)')

		if (checkUUID(serviceIdOrName)) {
			query.eq('service_id', serviceIdOrName)
		} else {
			serviceNameSchema.parse(serviceIdOrName)
			query.eq('service.name', serviceIdOrName)
		}

		const offset = options?.offset || 0
		const limit = options?.limit || 10

		const { data, error } = await query.range(offset, offset + limit)

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
		}))

		return z.array(invoiceSchema).parse(invoices)
	}
}
