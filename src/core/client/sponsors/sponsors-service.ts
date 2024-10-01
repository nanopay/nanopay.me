import { SITE_URL, SPONSOR_RECIPIENT_ADDRESS } from '@/core/constants'
import { BaseService } from '../base-service'
import { InvoicesService, InvoiceStatus } from '../invoices'
import { sponsorCreateSchema } from './sponsors-schema'
import { SponsorCreate, Sponsorship } from './sponsors-types'

const SPONSOR_SERVICE_SLUG = 'sponsors-service'

export class SponsorsService extends BaseService {
	async create(data: SponsorCreate) {
		sponsorCreateSchema.parse(data)

		const sponsorshipId = crypto.randomUUID()

		const invoicesService = new InvoicesService(this.supabase)

		const invoice = await invoicesService.create(SPONSOR_SERVICE_SLUG, {
			title: `${data.name} sponsorship`,
			price: data.amount,
			recipient_address: SPONSOR_RECIPIENT_ADDRESS,
			redirect_url: `${SITE_URL}/sponsors?id=${sponsorshipId}&new=true`,
		})

		const { data: sponsorship, error } = await this.supabase
			.from('sponsors')
			.insert({
				id: sponsorshipId,
				name: data.name,
				avatar_url: data.avatar_url,
				message: data.message,
				amount: data.amount,
				invoice_id: invoice.id,
			})
			.select('id')
			.single()

		if (error) {
			throw new Error(error.message)
		}

		return {
			sponsorship_id: sponsorship.id,
			invoice: {
				id: invoice.id,
				pay_address: invoice.pay_address,
				expires_at: invoice.expires_at,
			},
		}
	}

	async get(sponsorshipId: string): Promise<Sponsorship> {
		const { data, error } = await this.supabase
			.from('sponsors')
			.select(
				'*, invoice:invoices(*, service:services(id, slug, name, avatar_url, website, contact_email), payments(id, from, to, hash, amount, timestamp))',
			)
			.eq('id', sponsorshipId)
			.single()

		if (error) {
			throw new Error(error.message)
		}

		if (!data.invoice) {
			throw new Error('Invoice not found')
		}

		if (!data.invoice.service) {
			throw new Error('Service not found')
		}

		const invoice = {
			id: data.invoice.id,
			title: data.invoice.title,
			description: data.invoice.description,
			price: data.invoice.price,
			currency: data.invoice.currency,
			status: data.invoice.status as InvoiceStatus,
			created_at: data.invoice.created_at,
			expires_at: data.invoice.expires_at,
			pay_address: data.invoice.pay_address as string,
			has_redirect_url: !!data.invoice.redirect_url,
			received_amount: data.invoice.received_amount,
			refunded_amount: data.invoice.refunded_amount,
			payments: data.invoice.payments,
			service: data.invoice.service,
		}

		return {
			id: data.id,
			name: data.name,
			avatar_url: data.avatar_url,
			message: data.message,
			amount: data.amount,
			created_at: data.created_at,
			invoice,
		}
	}

	async list(): Promise<Sponsorship[]> {
		const { data, error } = await this.supabase
			.from('sponsors')
			.select(
				'*, invoice:invoices!inner(*, service:services(id, slug, name, avatar_url, website, contact_email), payments(id, from, to, hash, amount, timestamp))',
			)
			.order('created_at', { ascending: false })
			.eq('invoice.status', 'paid')

		if (error) {
			throw new Error(error.message)
		}

		return data.map(sponsor => {
			if (!sponsor.invoice) {
				throw new Error('Invoice not found')
			}

			if (!sponsor.invoice.service) {
				throw new Error('Service not found')
			}

			const invoice = {
				id: sponsor.invoice.id,
				title: sponsor.invoice.title,
				description: sponsor.invoice.description,
				price: sponsor.invoice.price,
				currency: sponsor.invoice.currency,
				status: sponsor.invoice.status as InvoiceStatus,
				created_at: sponsor.invoice.created_at,
				expires_at: sponsor.invoice.expires_at,
				pay_address: sponsor.invoice.pay_address as string,
				has_redirect_url: !!sponsor.invoice.redirect_url,
				received_amount: sponsor.invoice.received_amount,
				refunded_amount: sponsor.invoice.refunded_amount,
				payments: sponsor.invoice.payments,
				service: sponsor.invoice.service,
			}

			return {
				id: sponsor.id,
				name: sponsor.name,
				avatar_url: sponsor.avatar_url,
				message: sponsor.message,
				amount: sponsor.amount,
				created_at: sponsor.created_at,
				invoice,
			}
		})
	}
}
