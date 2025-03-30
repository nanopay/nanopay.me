import { useEffect, useState, useCallback } from 'react'
import {
	PaymentListener,
	PaymentNotification,
} from '@/services/payment-gateway'

export interface PaymentListenerProps {
	invoiceId: string
	listen?: boolean
}

export interface PaymentListenerResult {
	isListening: boolean
	isError: boolean
	payments: PaymentNotification[]
}

export const usePaymentsListener = ({
	invoiceId,
	listen = true,
}: PaymentListenerProps): PaymentListenerResult => {
	const [paymentListener] = useState(() => new PaymentListener(invoiceId))
	const [isListening, setIsListening] = useState(false)
	const [isError, setIsError] = useState(false)
	const [payments, setPayments] = useState<PaymentNotification[]>([])

	const handlePaymentReceived = useCallback(() => {
		setPayments(paymentListener.payments)
	}, [paymentListener])

	const connect = useCallback(() => {
		paymentListener.connect({
			onPayment: handlePaymentReceived,
			onError: () => {
				setIsError(true)
			},
			onOpen: () => {
				setIsListening(true)
				setIsError(false)
			},
			onClose: () => {
				setIsListening(false)
			},
		})
	}, [paymentListener, handlePaymentReceived])

	useEffect(() => {
		if (!listen) {
			paymentListener.disconnect()
			return
		}

		connect()

		return () => {
			paymentListener.disconnect()
		}
	}, [paymentListener, listen, connect])

	return {
		isListening,
		isError,
		payments,
	}
}
