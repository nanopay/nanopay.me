'use client'

import Invoice from '@/components/Invoice'
import Loading from '@/components/Loading'
import api from '@/services/api'
import Head from 'next/head'
import { useQuery } from 'react-query'

export default function InvoicePage({
	params: { invoiceId },
}: {
	params: {
		invoiceId: string
	}
}) {
	const {
		data: invoice,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['invoice', invoiceId],
		queryFn: () => api.invoices.get(invoiceId),
	})

	if (isLoading || isError) {
		return (
			<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
				<Loading />
			</div>
		)
	}

	if (!invoice) {
		return (
			<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
				<div className="text-center">
					<h1 className="text-4xl font-bold">Invoice not found</h1>
					<p className="text-gray-500 mt-2">{api.getErrorMessage(error)}</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Invoice - NanoPay.me</title>
			</Head>
			<div className="sm:mt-4 w-full max-w-5xl sm:mx-auto">
				<Invoice invoice={invoice} />
			</div>
		</>
	)
}
