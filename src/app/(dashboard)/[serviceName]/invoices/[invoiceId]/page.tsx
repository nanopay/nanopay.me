import { InvoiceCard } from '@/components/InvoiceCard'
import api from '@/services/api'
import { cookies } from 'next/headers'

const fetchData = async (invoiceId: string) => {
	return await api.invoices.get(invoiceId, {
		headers: {
			Cookie: cookies().toString(),
		},
	})
}

interface Props {
	params: {
		invoiceId: string
	}
}

export const generateMetadata = async ({ params }: Props) => {
	const invoice = await fetchData(params.invoiceId)
	return {
		title: `Invoice - ${invoice.title}`,
	}
}

export default async function InvoicePage({ params }: Props) {
	const invoice = await fetchData(params.invoiceId)
	return (
		<>
			<div className="w-full max-w-5xl sm:mx-auto sm:mt-4">
				<InvoiceCard invoice={invoice} />
			</div>
		</>
	)
}
