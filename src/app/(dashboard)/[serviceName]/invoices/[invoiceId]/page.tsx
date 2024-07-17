import { InvoiceCard } from '@/components/InvoiceCard'
import { Client } from '@/core/client'
import { cookies } from 'next/headers'
import Image from 'next/image'
import NotFoundImage from '@/images/not-found.svg'

const fetchData = async (invoiceId: string) => {
	const client = new Client(cookies())
	return await client.invoices.get(invoiceId)
}

interface Props {
	params: {
		invoiceId: string
	}
}

export const generateMetadata = async ({ params }: Props) => {
	const invoice = await fetchData(params.invoiceId)
	return {
		title: `Invoice - ${invoice ? invoice.title : 'Not found'}`,
	}
}

export default async function InvoicePage({ params }: Props) {
	const invoice = await fetchData(params.invoiceId)

	if (!invoice) {
		return (
			<div className="text-center">
				<Image
					src={NotFoundImage}
					alt="Not found"
					className="mx-auto mb-4 h-64 w-64"
				/>
				<h1 className="mb-4 text-2xl font-bold">Invoice not found</h1>
				<p className="text-slate-500">
					The invoice you are looking for does not exist.
				</p>
			</div>
		)
	}

	return (
		<>
			<div className="w-full max-w-5xl sm:mx-auto sm:mt-4">
				<InvoiceCard invoice={invoice} />
			</div>
		</>
	)
}
