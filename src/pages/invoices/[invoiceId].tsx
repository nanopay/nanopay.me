import Checkout from '@/components/Checkout'
import { Invoice } from '@/types/invoice'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { GetServerSidePropsContext } from 'next'

interface PaymentEvent {
	from: string
	to: string
	amount: number
	timestamp: number
}

export default function PayInvoice({ invoice }: { invoice: Invoice }) {
	if (!invoice) return <div>Invoice not found</div>

	const [paid, setPaid] = useState(invoice.status === 'paid')

	useEffect(() => {
		Pusher.logToConsole = true
		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
			cluster: 'us2',
		})
		const channel = pusher.subscribe(invoice.id.toString())
		channel.bind('payment', function (data: PaymentEvent) {
			setPaid(true)
		})

		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	}, [])

	return (
		<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
			<Checkout
				invoiceId={invoice.id.toString()}
				address={invoice.pay_address}
				amount={invoice.price}
				usd={1}
				paid={paid}
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
