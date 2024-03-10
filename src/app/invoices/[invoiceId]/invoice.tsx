'use client'

import Checkout from '@/components/Checkout'
import { PublicInvoice } from '@/types/invoice'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { Payment } from '@/types/payment'

interface PayInvoiceProps {
	invoice: PublicInvoice
	payments: Payment[]
	hasRedirectUrl: boolean
}

interface PaymentNotification {
	payments: Payment[]
	total_paid: number
	missing: number
}

export default function PayInvoice({
	invoice,
	payments: _payments,
	hasRedirectUrl,
}: PayInvoiceProps) {
	const [payments, setPayments] = useState<Payment[]>(_payments)

	useEffect(() => {
		if (!invoice) return

		const amountPaid = payments.reduce((acc, curr) => acc + curr.amount, 0)
		const paid = amountPaid >= invoice.price
		const timeLeft =
			new Date(invoice.expires_at).getTime() - new Date().getTime()
		const isExpired = !paid && timeLeft <= 0

		if (paid || isExpired) return

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

		// auto unsubscribe when expires
		setTimeout(() => {
			channel.unbind_all()
			channel.unsubscribe()
		}, timeLeft)

		return () => {
			channel.unbind_all()
			channel.unsubscribe()
		}
	}, [invoice])

	if (!invoice) return <div>Invoice not found</div>

	return (
		<div className="mx-auto flex h-screen w-full max-w-4xl justify-center md:items-center">
			<Checkout
				invoiceId={invoice.id.toString()}
				title={invoice.title}
				description={invoice.description}
				address={invoice.pay_address}
				amount={invoice.price}
				usd={1}
				payments={payments}
				expiresAt={new Date(invoice.expires_at)}
				service={invoice.service}
				hasRedirectUrl={hasRedirectUrl}
			/>
		</div>
	)
}
