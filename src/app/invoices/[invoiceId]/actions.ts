'use server'

import { AdminClient } from '@/services/client'
import { redirect } from 'next/navigation'

export const redirectToMerchant = async (invoiceId: string) => {
	const client = new AdminClient()
	const invoice = await client.invoices.get(invoiceId)

	if (!invoice) {
		throw new Error('Invoice not found')
	}

	if (!invoice.redirect_url) {
		throw new Error('Redirect URL not found')
	}

	redirect(invoice.redirect_url)
}
