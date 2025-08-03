import Image from 'next/image'
import InvoiceReceiptPdf from './pdf'
import NotFoundImage from '@/images/not-found.svg'
import { AdminClient } from '@/core/client'
import { unstable_cache } from 'next/cache'
import { SUPPORT_EMAIL } from '@/core/constants'

export default async function ReceiptPDF(props: {
	params: Promise<{
		invoiceId: string
	}>
}) {
	const params = await props.params
	const client = new AdminClient()

	const invoice = await unstable_cache(
		() => client.invoices.getPublicInvoice(params.invoiceId),
		[`invoice-${params.invoiceId}`],
	)()

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

	return <InvoiceReceiptPdf invoice={invoice} />
}
