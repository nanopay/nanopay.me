import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { PaymentNotification } from '@/services/payment-gateway'
import { MAX_PAYMENTS_PER_INVOICE } from '@/core/constants'

export interface PaymentStatusProps {
	payments: PaymentNotification[]
	price: string | number
}

export interface PaymentStatusResult {
	amountPaid: number
	amountMissing: number
	isPaid: boolean
	isPartiallyPaid: boolean
	maxPaymentsReached: boolean
}

export const usePaymentStatus = ({
	payments,
	price,
}: PaymentStatusProps): PaymentStatusResult => {
	// Convert price to BigNumber for precise calculations
	const priceBN = useMemo(() => BigNumber(price), [price])

	// Calculate total amount paid from all payments
	const amountPaid = useMemo(
		() =>
			payments
				.reduce((acc, curr) => acc.plus(curr.amount), BigNumber(0))
				.toNumber(),
		[payments],
	)

	// Calculate remaining amount (ensure it’s not negative)
	const amountMissing = useMemo(
		() => Math.max(priceBN.minus(amountPaid).toNumber(), 0),
		[priceBN, amountPaid],
	)

	// Determine if the invoice is fully paid
	const isPaid = useMemo(
		() => amountPaid >= priceBN.toNumber(),
		[amountPaid, priceBN],
	)

	// Determine if the invoice is partially paid (not fully paid but some payment exists)
	const isPartiallyPaid = useMemo(
		() => !isPaid && amountPaid > 0,
		[isPaid, amountPaid],
	)

	// Determine if the maximum number of payments has been reached
	const maxPaymentsReached =
		payments.length >= MAX_PAYMENTS_PER_INVOICE && !isPaid

	return {
		amountPaid,
		amountMissing,
		isPaid,
		isPartiallyPaid,
		maxPaymentsReached,
	}
}
