import { useEffect, useState, useRef } from 'react'
import { paymentSchema } from '@/core/client'
import { z } from 'zod'
import { paymentGateway } from '@/services/payment-gateway'
import BigNumber from 'bignumber.js'

const paymentNotificationSchema = paymentSchema.omit({ id: true })

type PaymentNotification = z.infer<typeof paymentNotificationSchema>

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

	const socketRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		if (isPaid || isExpired) return

		if (!socketRef.current) {
			const websocketUrl = paymentGateway.buildPaymentsWebsocketUrl(invoiceId)
			socketRef.current = new WebSocket(websocketUrl)

			socketRef.current.onopen = () => {
				console.info('WebSocket connected')
			}

			socketRef.current.onmessage = event => {
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

			socketRef.current.onerror = error => {
				console.error('WebSocket error:', error)
			}

			socketRef.current.onclose = () => {
				console.info('WebSocket connection closed')
			}
		}

		const timeoutId = setTimeout(() => {
			setIsExpired(true)
		}, timeLeft)

		// Clean up WebSocket on component unmount or when the invoice expires
		return () => {
			clearTimeout(timeoutId)
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				socketRef.current.close()
				socketRef.current = null
			}
		}
	}, [invoiceId, isPaid, isExpired, socketRef.current])

	return {
		isPaid,
		isPartiallyPaid,
		amountPaid,
		payments,
		isExpired,
		amountMissing,
	}
}
