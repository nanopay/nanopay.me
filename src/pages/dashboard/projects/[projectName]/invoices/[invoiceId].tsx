import { Header } from '@/components/Header'
import Invoice from '@/components/Invoice'
import Loading from '@/components/Loading'
import api from '@/services/api'
import { UserProfile } from '@/types/users'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

export default function InvoicePage({ user }: { user: UserProfile }) {
	const router = useRouter()
	const invoiceId = router.query.invoiceId as string

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
				<title>Dashboard - NanoPay.me</title>
			</Head>
			<Header user={user} className="bg-white border-b border-slate-100" />
			<div className="sm:mt-4 w-full max-w-5xl mx-auto">
				<Invoice invoice={invoice} />
			</div>
		</>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createServerSupabaseClient(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	return {
		props: {
			user: session?.user?.user_metadata?.internal_profile || {
				name: 'error',
				email: 'error',
				avatar_url: 'error',
			},
		},
	}
}
