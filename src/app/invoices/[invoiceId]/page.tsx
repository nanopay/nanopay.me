import api from '@/services/api'
import PayInvoice from './invoice'
import NotFoundImage from '@/images/not-found.svg'
import { FetcherError } from '@/lib/fetcher'
import Image from 'next/image'
import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/constants'
import paymentGateway from '@/services/payment-gateway'

interface InvoicePageProps {
	params: {
		invoiceId: string
	}
}

export default async function InvoicePage({
	params: { invoiceId },
}: InvoicePageProps) {
	try {
		const invoice = await paymentGateway.invoices.get(invoiceId, {
			next: {
				revalidate: 1,
				tags: [`invoice-${invoiceId}`],
			},
		})

		const payments = await api.invoices.payments(invoiceId, {
			next: {
				revalidate: 1,
				tags: [`invoice-${invoiceId}-payments`],
			},
		})

		return (
			<PayInvoice
				invoice={invoice}
				payments={payments}
				hasRedirectUrl={!!invoice.redirect_url}
			/>
		)
	} catch (error) {
		if (error instanceof FetcherError && error.status === 404) {
			return (
				<div className="flex h-screen items-center justify-center">
					<div className="text-center">
						<Image
							src={NotFoundImage}
							alt="Not found"
							className="mx-auto mb-4 h-80 w-80"
						/>
						<h1 className="mb-4 text-2xl font-bold">Invoice not found</h1>
						<p className="text-slate-500">
							The invoice you are looking for does not exist.
						</p>
						<div className="hover:text-nano mt-16 text-sm text-slate-500">
							<Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
						</div>
					</div>
				</div>
			)
		}

		const message = api.getErrorMessage(error) || 'Unknown error'

		throw new Error(message)
	}
}
