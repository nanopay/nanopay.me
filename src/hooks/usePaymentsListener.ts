import { useEffect, useState } from 'react'
import { paymentSchema } from '@/core/client'
import { z } from 'zod'
import { paymentGateway } from '@/services/payment-gateway'
import BigNumber from 'bignumber.js'

const paymentNotificationSchema = paymentSchema.omit({ id: true })

export type PaymentNotification = z.infer<typeof paymentNotificationSchema>

interface PaymentListenerProps {
	invoiceId: string
	price: number
	expiresAt: string
	initialPayments: PaymentNotification[]
}

export const usePaymentsListener = ({
	invoiceId,
	price,
	expiresAt,
	initialPayments,
}: PaymentListenerProps) => {
	const [websocket, setWebsocket] = useState<WebSocket | null>(null)
	const [isListening, setIsListening] = useState(false)
	const [isError, setIsError] = useState(false)

	const [payments, setPayments] =
		useState<PaymentNotification[]>(initialPayments)

	const amountPaid = payments
		.reduce((acc, curr) => BigNumber(acc).plus(curr.amount), BigNumber(0))
		.toNumber()

	const amountMissing = Math.max(
		BigNumber(price).minus(amountPaid).toNumber(),
		0,
	)
	const isPaid = amountPaid >= price
	const timeLeft = new Date(expiresAt).getTime() - new Date().getTime()
	const isPartiallyPaid = !isPaid && amountPaid > 0

	const [isExpired, setIsExpired] = useState(!isPaid && timeLeft <= 0)

	const connect = () => {
		const websocketUrl = paymentGateway.buildPaymentsWebsocketUrl(invoiceId)
		const websocket = new WebSocket(websocketUrl)

		setWebsocket(websocket)

		websocket.onopen = () => {
			console.info('WebSocket connected')
			setIsError(false)
			setIsListening(true)
		}

		websocket.onmessage = event => {
			try {
				const data = paymentNotificationSchema.parse(JSON.parse(event.data))
				setPayments(prevPayments => {
					// Prevent duplicates
					if (prevPayments.some(p => p.hash === data.hash)) {
						return prevPayments
					}
					return [...prevPayments, data]
				})
			} catch (error) {
				console.error('Error parsing WebSocket message:', error)
			}
		}

		websocket.onerror = error => {
			setIsError(true)
			setWebsocket(null)
			console.error('WebSocket error:', error)
		}

		websocket.onclose = () => {
			console.info('WebSocket connection closed')
			setIsListening(false)
		}
	}

	useEffect(() => {
		if (isPaid || isExpired) return

		if (!websocket) {
			if (isError) {
				setTimeout(() => {
					connect()
				}, 2000)
				return
			}
			connect()
		}

		const timeoutId = setTimeout(() => {
			setIsExpired(true)
			if (websocket?.readyState === WebSocket.OPEN) {
				websocket.close()
				setWebsocket(null)
			}
		}, timeLeft)

		// Clean up WebSocket on component unmount or when the invoice expires
		return () => {
			clearTimeout(timeoutId)
		}
	}, [invoiceId, isPaid, isExpired, isError, websocket])

	return {
		isListening,
		isError,
		isPaid,
		isPartiallyPaid,
		amountPaid,
		payments,
		isExpired,
		amountMissing,
	}
}
