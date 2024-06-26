import PayInvoice from './invoice'
import NotFoundImage from '@/images/not-found.svg'
import Image from 'next/image'
import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/constants'
import { AdminClient } from '@/services/client'

interface InvoicePageProps {
	params: {
		invoiceId: string
	}
}

export default async function InvoicePage({
	params: { invoiceId },
}: InvoicePageProps) {
	const client = new AdminClient()
	const invoice = await client.invoices.getPublicInvoice(invoiceId)

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
						<Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
					</div>
				</div>
			</div>
		)
	}

	return <PayInvoice invoice={invoice} />
}
