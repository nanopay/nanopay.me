'use client'

import Checkout from '@/components/Checkout'
import { InvoicePublic } from '@/services/client'
import { usePaymentsListener } from '@/hooks/usePaymentsListener'

export default function PayInvoice({ invoice }: { invoice: InvoicePublic }) {
	const { payments } = usePaymentsListener({
		invoiceId: invoice.id.toString(),
		price: invoice.price,
		expires_at: invoice.expires_at,
		initialPayments: invoice.payments,
	})

	return (
		<div className="mx-auto flex h-screen w-full max-w-4xl justify-center md:items-center">
			<Checkout
				invoiceId={invoice.id.toString()}
				title={invoice.title}
				description={invoice.description}
				address={invoice.pay_address}
				amount={invoice.price}
				usd={1}
				payments={payments}
				expiresAt={new Date(invoice.expires_at)}
				service={invoice.service}
				hasRedirectUrl={invoice.has_redirect_url}
			/>
		</div>
	)
}
