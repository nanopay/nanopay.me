import Checkout from '@/components/Checkout'
import { Invoice } from '@/types/invoice'
import { GetServerSidePropsContext } from 'next'

export default function PayInvoice({ invoice }: { invoice: Invoice }) {
	return (
		<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
			<Checkout
				invoiceId={invoice.id}
				address={invoice.pay_address}
				amount={invoice.price}
				usd={1}
				paid={false}
				expiresAt={new Date(invoice.expires_at)}
			/>
		</div>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const { invoiceId } = ctx.query

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
	)

	const invoice = await res.json()

	return {
		props: {
			invoice,
		},
	}
}
