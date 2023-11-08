import Invoice from '@/components/Invoice'
import Loading from '@/components/Loading'
import Layout from '@/components/Layout'
import api from '@/services/api'
import { UserProfile } from '@/types/users'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useAuth } from '@/contexts/AuthProvider'

export default function InvoicePage() {
	const router = useRouter()
	const invoiceId = router.query.invoiceId as string

	const { user } = useAuth()

	const {
		data: invoice,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['invoice', invoiceId],
		queryFn: () => api.invoices.get(invoiceId).then(res => res.data),
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
			<Layout user={user}>
				<div className="sm:mt-4 w-full max-w-5xl sm:mx-auto">
					<Invoice invoice={invoice} />
				</div>
			</Layout>
		</>
	)
}
