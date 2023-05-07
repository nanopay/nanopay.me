import Checkout from '@/components/Checkout'
import { Invoice } from '@/types/invoice'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { GetServerSidePropsContext } from 'next'
import { Payment } from '@/types/payment'
import api from '@/services/api'

interface PayInvoiceProps {
	invoice: Invoice
	payments: Payment[]
}

interface PaymentNotification {
	payments: Payment[]
	total_paid: number
	missing: number
}

export default function PayInvoice({
	invoice,
	payments: _payments,
}: PayInvoiceProps) {
	const [payments, setPayments] = useState<Payment[]>(_payments)

	useEffect(() => {
		if (!invoice) return
		Pusher.logToConsole = true
		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
			cluster: 'us2',
		})
		const channel = pusher.subscribe(invoice.id.toString())
		channel.bind('invoice.paid', (data: PaymentNotification) => {
			setPayments([...payments, ...data.payments])
		})
		channel.bind('invoice.partially_paid', (data: PaymentNotification) => {
			setPayments([...payments, ...data.payments])
		})

		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	}, [invoice])

	if (!invoice) return <div>Invoice not found</div>

	return (
		<div className="w-full max-w-3xl mx-auto h-screen flex sm:items-center justify-center">
			<Checkout
				invoiceId={invoice.id.toString()}
				address={invoice.pay_address}
				amount={invoice.price}
				usd={1}
				payments={payments}
				expiresAt={new Date(invoice.expires_at)}
				service={invoice.service}
				redirectUrl={invoice.redirect_url}
			/>
		</div>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	try {
		const { invoiceId } = ctx.query

		if (typeof invoiceId !== 'string') {
			throw new Error('Invalid invoice ID')
		}

		const invoice = await api.invoices.get(invoiceId).then(res => res.data)
		const payments = await api.invoices
			.payments(invoiceId)
			.then(res => res.data)

		return {
			props: {
				invoice,
				payments,
			},
		}
	} catch (err: any) {
		console.error(err)
		return {
			props: {
				invoice: null,
				payments: [],
			},
		}
	}
}
