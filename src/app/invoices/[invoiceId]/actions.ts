'use server'

import { safeAction } from '@/lib/safe-action'
import { AdminClient } from '@/core/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const redirectToMerchant = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: invoiceId }) => {
		const client = new AdminClient()
		const invoice = await client.invoices.get(invoiceId)

		if (!invoice) {
			throw new Error('Invoice not found')
		}

		if (invoice.status !== 'paid') {
			throw new Error('Invoice not paid')
		}

		if (!invoice.redirect_url) {
			throw new Error('Redirect URL not found')
		}

		redirect(invoice.redirect_url)
	})
