import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { Payment } from '@/core/client'

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY!
const PUSHER_CLUSTER = 'us2'

interface PaymentNotification {
	payments: Payment[]
	total_paid: number
	missing: number
}

interface PaymentListenerProps {
	invoiceId: string
	price: number
	expires_at: string
	initialPayments: Payment[]
}

export const usePaymentsListener = (props: PaymentListenerProps) => {
	const [payments, setPayments] = useState<Payment[]>(props.initialPayments)

	const amountPaid = payments.reduce((acc, curr) => acc + curr.amount, 0)
	const amountMissing = props.price - amountPaid
	const isPaid = amountPaid >= props.price
	const timeLeft = new Date(props.expires_at).getTime() - new Date().getTime()
	const isExpired = !isPaid && timeLeft <= 0
	const isPartiallyPaid = !isPaid && amountPaid > 0

	useEffect(() => {
		if (isPaid || isExpired) return

		Pusher.logToConsole = true
		const pusher = new Pusher(PUSHER_KEY, {
			cluster: PUSHER_CLUSTER,
		})
		const channel = pusher.subscribe(props.invoiceId)
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
	}, [props, payments, isPaid, isExpired, timeLeft])

	return {
		isPaid,
		isPartiallyPaid,
		amountPaid,
		payments,
		isExpired,
		amountMissing,
	}
}
