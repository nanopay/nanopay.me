import NotFoundImage from '@/images/not-found.svg'
import Image from 'next/image'
import { SUPPORT_EMAIL } from '@/core/constants'
import { AdminClient } from '@/core/client'
import Checkout from '@/components/Checkout'
import { getLatestPrice } from '@/services/coinmarketcap'
import { unstable_noStore } from 'next/cache'
import { Viewport } from 'next'
import colors from 'tailwindcss/colors'

export const viewport: Viewport = {
	themeColor: colors.slate[800],
}

interface InvoicePageProps {
	params: Promise<{
		invoiceId: string
	}>
}

export default async function InvoicePage(props: InvoicePageProps) {
	const params = await props.params

	const { invoiceId } = params

	unstable_noStore()

	const client = new AdminClient()

	const [invoice, { price: xnoToUsd }] = await Promise.all([
		client.invoices.getPublicInvoice(invoiceId),
		getLatestPrice().catch(() => ({
			price: null,
		})),
	])

	if (!invoice) {
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
						<a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto flex h-screen w-full max-w-3xl justify-center md:items-center">
			<Checkout invoice={invoice} xnoToUsd={xnoToUsd} />
		</div>
	)
}
