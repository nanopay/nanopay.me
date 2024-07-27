'use server'

import { safeAction } from '@/lib/safe-action'
import { AdminClient, invoiceCreateSchema } from '@/core/client'

const serviceIdOrSlug = 'demo-service'

export const createDemoInvoice = safeAction
	.schema(invoiceCreateSchema)
	.action(async ({ parsedInput }) => {
		const client = new AdminClient()

		const { id } = await client.invoices.create(serviceIdOrSlug, {
			title: parsedInput.title,
			description: parsedInput.description,
			metadata: parsedInput.metadata,
			price: parsedInput.price,
			recipient_address: parsedInput.recipient_address,
			redirect_url: parsedInput.redirect_url,
		})

		return { id }
	})
