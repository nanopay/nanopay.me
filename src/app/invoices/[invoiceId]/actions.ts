'use server'

import paymentGateway from '@/services/payment-gateway'
import { redirect } from 'next/navigation'

export const redirectToMerchant = async (invoiceId: string) => {
	const invoice = await paymentGateway.invoices.get(invoiceId, {
		next: {
			revalidate: 1,
			tags: [`invoice-${invoiceId}`],
		},
	})

	if (!invoice.redirect_url) {
		throw new Error('Redirect URL not found')
	}

	redirect(invoice.redirect_url)
}
