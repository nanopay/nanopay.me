'use client'

import { Button } from '@/components/Button'
import QrCodeBorder from '@/components/QrCodeBorder'
import Transactions from '@/components/Transactions'
import { InvoicePublic, Payment } from '@/core/client'
import {
	MAX_PAYMENTS_PER_INVOICE,
	REFUND_EMAIL,
	SUPPORT_EMAIL,
} from '@/core/constants'
import {
	PaymentNotification,
	usePaymentsListener,
} from '@/hooks/usePaymentsListener'
import { formatDateTime, toFiatCurrency, truncateAddress } from '@/utils/others'
import {
	AlertCircleIcon,
	ArrowDownToLineIcon,
	CopyCheckIcon,
	CopyIcon,
	ExternalLinkIcon,
	QrCodeIcon,
} from 'lucide-react'
import { convert, Unit } from 'nanocurrency'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import QRCode from 'react-qr-code'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
import { redirectToMerchant } from '../app/invoices/[invoiceId]/actions'
import { cn } from '@/lib/cn'
import { Drawer, DrawerContent } from './ui/drawer'
import Fireworks from './Fireworks'
import { Skeleton } from './ui/skeleton'

export function InvoicePayCard({
	invoice,
	xnoToUsd,
	autoRedirectOnPay = false,
	fireworks = false,
	...props
}: React.ComponentPropsWithoutRef<'div'> & {
	invoice: InvoicePublic
	xnoToUsd: number | null
	autoRedirectOnPay?: boolean
	fireworks?: boolean
}) {
	const {
		isPaid,
		isPartiallyPaid,
		amountPaid,
		payments,
		amountMissing,
		isExpired,
		isListening,
		isError: listenerError,
	} = usePaymentsListener({
		invoiceId: invoice.id,
		price: invoice.price,
		expiresAt: invoice.expires_at,
		initialPayments: invoice.payments,
	})

	const [openQrCode, setOpenQrCode] = useState(false)
	const [rendered, setRendered] = useState(false)
	const [addressCopied, setAddressCopied] = useState(false)
	const [autoRedirectAt, setAutoRedirectAt] = useState<number | null>(null)
	const [showFireworks, setShowFireworks] = useState(false)

	const handleOpenQrCode = () => {
		setOpenQrCode(true)
	}

	const maxPaymentsReached =
		payments.length >= MAX_PAYMENTS_PER_INVOICE && !isPaid

	const payURI = `nano:${invoice.pay_address}?amount=${convert(
		amountMissing.toString(),
		{
			from: Unit.Nano,
			to: Unit.raw,
		},
	)}`

	const handleCopyAddress = () => {
		navigator.clipboard.writeText(invoice.pay_address)
		setAddressCopied(true)
		setTimeout(() => {
			setAddressCopied(false)
		}, 2000)
	}

	const priceUsd = xnoToUsd
		? BigNumber(xnoToUsd).multipliedBy(amountMissing).toNumber()
		: null

	const lastPayment = payments[payments.length - 1]

	const { execute: executeRedirectToMechant } = useAction(redirectToMerchant, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			alert(`Error redirecting to merchant: ${message}`)
		},
	})

	const handleAutoRedirect = () => {
		setAutoRedirectAt(Date.now() + 5000)
		setTimeout(() => {
			executeRedirectToMechant(invoice.id)
		}, 5000)
	}

	useEffect(() => {
		setRendered(true)
	}, [])

	useEffect(() => {
		if (isPaid) {
			setOpenQrCode(false)
			const wasLoadedPaid = invoice.status === 'paid'
			if (!wasLoadedPaid) {
				if (fireworks) setShowFireworks(true)
				if (autoRedirectOnPay) handleAutoRedirect()
			}
		}
	}, [isPaid, autoRedirectOnPay, invoice.status, fireworks, handleAutoRedirect])

	const handleRedirectToMerchant = () => {
		executeRedirectToMechant(invoice.id)
	}

	return (
		<div
			{...props}
			className={cn(
				'flex w-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:px-20 md:max-w-[480px] md:px-4',
				props.className,
			)}
		>
			{isExpired || maxPaymentsReached || listenerError ? (
				<InvoicePayCardError
					invoice={invoice}
					amountPaid={amountPaid}
					payments={payments}
					isExpired={isExpired}
					maxPaymentsReached={maxPaymentsReached}
					listenerError={listenerError}
				/>
			) : isPaid ? (
				<>
					<div className="flex flex-1 items-center justify-center py-4">
						<div className="flex flex-col items-center gap-2">
							<SuccessIcon />
							<h3 className="text-xl font-semibold text-slate-600">
								Paid Ӿ{amountPaid}
							</h3>
							{!!priceUsd && (
								<div className="text-sm leading-3 text-slate-500 sm:text-xs">
									~ US${toFiatCurrency(priceUsd)}
								</div>
							)}
							<div className="mt-4 flex flex-col gap-1">
								<Link href={`/invoices/${invoice.id}/receipt`} target="_blank">
									<Button
										variant="ghost"
										className="PayButton w-full bg-slate-200 text-slate-600 sm:w-auto"
									>
										Get Receipt
										<ArrowDownToLineIcon className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</div>
						</div>
					</div>

					{invoice.has_redirect_url && (
						<div className="flex justify-center py-4">
							{autoRedirectAt ? (
								<Button
									className="PayButton w-full sm:w-auto"
									type="button"
									onClick={handleRedirectToMerchant}
								>
									<span className="mr-1">Redirecting in</span>
									<Countdown
										date={autoRedirectAt}
										zeroPadTime={2}
										renderer={props => (
											<div className="font-medium text-white">
												{props.minutes}:
												{props.seconds.toString().padStart(2, '0')}
											</div>
										)}
									/>
									<ExternalLinkIcon className="ml-2 h-3 w-3" />
								</Button>
							) : (
								<Button
									className="PayButton w-full sm:w-auto"
									type="button"
									onClick={handleRedirectToMerchant}
								>
									Continue to {invoice.service.name}
									<ExternalLinkIcon className="ml-2 h-4 w-4" />
								</Button>
							)}
						</div>
					)}

					<div className="sm:px-4">
						<div className="flex justify-between border-y border-dashed border-slate-200 py-2 text-sm">
							<div className="text-slate-500">Invoice</div>
							<div className="font-medium text-slate-900">#{invoice.id}</div>
						</div>
						<div className="flex justify-between border-b border-dashed border-slate-200 py-2 text-sm">
							<div className="text-slate-500">Paid At</div>
							{formatDateTime(lastPayment.timestamp)}
						</div>

						<Transactions
							transactions={payments.map(payment => {
								return {
									amount: payment.amount,
									hash: payment.hash,
									timestamp: payment.timestamp,
								}
							})}
						/>
					</div>
				</>
			) : !isListening ? (
				<InvoicePayCardSkeleton className="shadow-none" />
			) : (
				<>
					{isPartiallyPaid && (
						<div className="my-2 w-full rounded border border-yellow-300 bg-yellow-100 px-4 py-2 text-yellow-800">
							<div className="flex items-center gap-2">
								<AlertCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
								<h3 className="font-semibold sm:text-lg">Partially Paid</h3>
							</div>
							<p className="mt-1 text-xs sm:text-sm">
								You have paid Ӿ{amountPaid} of Ӿ{invoice.price}. Pay the missing
								amount Ӿ{amountMissing}
							</p>
						</div>
					)}
					<div className="my-2 flex items-center justify-between pb-2 md:hidden">
						<button
							className="flex items-center gap-2 md:hidden"
							onClick={handleOpenQrCode}
						>
							<QrCodeIcon className="h-5 w-5 text-slate-500" />
							<div className="text-xs font-semibold text-slate-500">
								QR Code
							</div>
						</button>
						<div className="hidden sm:block" />
						<div className="flex items-center justify-center gap-2 text-xs text-slate-500">
							<div className="border-nano/40 border-t-nano h-4 w-4 animate-spin rounded-full border border-t-2" />
							<div className="flex gap-2">
								Expires in:
								{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
								{rendered && (
									<Countdown
										date={invoice.expires_at}
										zeroPadTime={2}
										renderer={props => (
											<div className="font-medium text-slate-900">
												{props.minutes}:
												{props.seconds.toString().padStart(2, '0')}
											</div>
										)}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="flex-1 py-4 sm:px-4">
						<div className="flex flex-1 flex-col md:flex-row">
							<div className="hidden justify-center border-r border-slate-100 pr-12 md:flex">
								<div className="relative flex h-36 w-36 flex-none items-center justify-center">
									<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
									<QRCode
										value={payURI}
										fgColor="#1e293b"
										className="h-28 w-28 rounded"
									/>
								</div>
							</div>
							<div className="flex flex-1 flex-col items-center justify-center">
								<div className="flex flex-col items-center justify-center gap-1 py-2 text-slate-800 sm:py-4">
									<div className="text-3xl font-semibold text-slate-700 md:text-2xl">
										<span className="">Ӿ</span> {amountMissing}
									</div>
									{priceUsd && (
										<div className="text-sm leading-3 text-slate-500 sm:text-xs">
											~ US${toFiatCurrency(priceUsd)}
										</div>
									)}
								</div>

								<div className="hidden items-center justify-center gap-2 py-4 text-xs text-slate-500 md:flex">
									<div className="border-nano/40 border-t-nano h-4 w-4 animate-spin rounded-full border border-t-2" />
									<div className="flex gap-2">
										Expires in:
										{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
										{rendered && (
											<Countdown
												date={invoice.expires_at}
												zeroPadTime={2}
												renderer={props => (
													<div className="font-medium text-slate-900">
														{props.minutes}:
														{props.seconds.toString().padStart(2, '0')}
													</div>
												)}
											/>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="mt-4 flex items-center justify-between gap-2 border-y border-dashed border-slate-200 py-2 text-sm text-slate-500">
							<div>Send to:</div>
							<div>{truncateAddress(invoice.pay_address)}</div>
							<button onClick={handleCopyAddress} className="hover:text-nano">
								{addressCopied ? (
									<CopyCheckIcon className="text-nano h-4 w-4" />
								) : (
									<CopyIcon className="h-4 w-4" />
								)}
							</button>
						</div>

						<div className="text-sm">
							<div className="flex justify-between border-b border-dashed border-slate-200 py-2">
								<div className="text-slate-500">Invoice</div>
								<div className="font-medium text-slate-900">#{invoice.id}</div>
							</div>
						</div>
						<div className="mt-6 flex justify-center">
							<a href={payURI}>
								<Button className="PayButton w-full sm:w-auto">
									Open Wallet
									<ExternalLinkIcon className="ml-2 h-4 w-4" />
								</Button>
							</a>
						</div>

						{payments.length > 0 && (
							<Transactions
								transactions={payments.map(payment => {
									return {
										amount: payment.amount,
										hash: payment.hash,
										timestamp: payment.timestamp,
									}
								})}
							/>
						)}
					</div>
				</>
			)}
			<Drawer open={openQrCode} onOpenChange={setOpenQrCode}>
				<DrawerContent>
					<div className="flex justify-center py-10">
						<div className="relative flex h-48 w-48 flex-none items-center justify-center">
							<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
							<QRCode
								value={payURI}
								fgColor="#1e293b"
								className="h-40 w-40 rounded"
							/>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
			{showFireworks && <Fireworks count={3} />}
		</div>
	)
}

function InvoicePayCardError({
	invoice,
	amountPaid,
	payments,
	isExpired,
	maxPaymentsReached,
	listenerError,
	...props
}: {
	invoice: InvoicePublic
	amountPaid: number
	payments: PaymentNotification[]
	isExpired: boolean
	maxPaymentsReached: boolean
	listenerError: boolean
} & React.ComponentPropsWithoutRef<'div'>) {
	return (
		<>
			<div
				{...props}
				className={cn(
					'flex flex-1 items-center justify-center py-4',
					props.className,
				)}
			>
				<div className="flex flex-col items-center gap-2">
					<ErrorIcon />
					<h3 className="text-xl font-semibold text-slate-600">
						{(isExpired && 'Expired') ||
							(maxPaymentsReached && 'Max Payments Reached') ||
							(listenerError && 'Error Listening Payments')}
					</h3>
					{amountPaid > 0 && (
						<div className="mt-4 flex flex-col gap-1">
							<a
								href={`mailto:${REFUND_EMAIL}?subject=Refund to Invoice #${invoice.id}&body=Please refund me the amount of Ӿ${amountPaid} to the following address: <YOUR_ADDRESS_HERE>`}
							>
								<Button
									variant="ghost"
									className="PayButton w-full bg-slate-100 text-slate-600 sm:w-auto"
								>
									Refund Ӿ{amountPaid}
									<ReceiptRefundIcon className="ml-2 h-4 w-4" />
								</Button>
							</a>
						</div>
					)}

					{listenerError && (
						<div className="mt-4 flex flex-col items-center gap-1">
							<div className="mb-4">
								<p>Please, reload the page and try again.</p>
								<p>If the problem persists, contact support.</p>
							</div>

							<a
								href={`mailto:${SUPPORT_EMAIL}?subject=Error Listening Payments for Invoice #${invoice.id}&body=I'm having trouble paying the invoice #${invoice.id}. Please help me!`}
							>
								<Button
									variant="ghost"
									className="PayButton w-full bg-slate-100 text-slate-600 sm:w-auto"
								>
									Support
								</Button>
							</a>
						</div>
					)}
				</div>
			</div>

			<div className="divide-y divide-dashed divide-slate-200 border-t border-dashed border-slate-200 sm:px-4">
				<div className="flex justify-between py-2 text-sm">
					<div className="text-slate-500">Invoice</div>
					<div className="font-medium text-slate-900">#{invoice.id}</div>
				</div>
				{isExpired && (
					<div className="flex justify-between py-2 text-sm">
						<div className="text-slate-500">Expired At</div>
						{formatDateTime(invoice.expires_at)}
					</div>
				)}

				{payments.length > 0 && (
					<Transactions
						transactions={payments.map(payment => {
							return {
								amount: payment.amount,
								hash: payment.hash,
								timestamp: payment.timestamp,
							}
						})}
					/>
				)}
			</div>
		</>
	)
}

function InvoicePayCardSkeleton({
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			{...props}
			className={cn(
				'mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md',
				props.className,
			)}
		>
			<div className="space-y-6">
				{/* QR Code Skeleton */}
				<div className="flex items-center justify-between">
					<Skeleton className="bg-primary/20 h-4 w-16" />
					<Skeleton className="bg-primary/20 h-4 w-24" />
				</div>

				{/* Central Loading Indicator */}
				<div className="flex h-24 items-center justify-center">
					<div className="border-primary/30 border-t-primary/60 h-12 w-12 animate-spin rounded-full border-4 border-t-4" />
				</div>

				{/* Send To Skeleton */}
				<div className="space-y-2">
					<Skeleton className="bg-primary/20 h-4 w-16" />
					<div className="flex items-center space-x-2">
						<Skeleton className="bg-primary/20 h-6 w-48" />
						<Skeleton className="bg-primary/20 h-6 w-6" />
					</div>
				</div>

				{/* Open Wallet Button Skeleton */}
				<Skeleton className="bg-primary/20 h-10 w-full rounded-md" />
			</div>
		</div>
	)
}

function SuccessIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="115px"
			height="115px"
			viewBox="0 0 133 133"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			{...props}
		>
			<g
				id="check-group"
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
			>
				<circle
					id="filled-circle"
					fill="#07b481"
					cx="66.5"
					cy="66.5"
					r="54.5"
				/>
				<circle id="white-circle" fill="#FFFFFF" cx="66.5" cy="66.5" r="55.5" />
				<circle
					id="outline"
					stroke="#07b481"
					strokeWidth="4"
					cx="66.5"
					cy="66.5"
					r="54.5"
				/>
				<polyline
					id="check"
					stroke="#FFFFFF"
					strokeWidth="5.5"
					points="41 70 56 85 92 49"
				/>
			</g>
		</svg>
	)
}

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="115px"
			height="115px"
			viewBox="0 0 133 133"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			{...props}
		>
			<g
				id="x-group"
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
			>
				<circle
					id="filled-circle"
					fill="#be123c"
					cx="66.5"
					cy="66.5"
					r="54.5"
				/>
				<circle id="white-circle" fill="#FFFFFF" cx="66.5" cy="66.5" r="55.5" />
				<circle
					id="outline"
					stroke="#be123c"
					strokeWidth="4"
					cx="66.5"
					cy="66.5"
					r="54.5"
				/>
				<line
					id="x-line-1"
					stroke="#FFFFFF"
					strokeWidth="5.5"
					x1="41"
					y1="41"
					x2="92"
					y2="92"
				/>
				<line
					id="x-line-2"
					stroke="#FFFFFF"
					strokeWidth="5.5"
					x1="41"
					y1="92"
					x2="92"
					y2="41"
				/>
			</g>
		</svg>
	)
}

function ReceiptRefundIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={cn('h-6 w-6', props.className)}
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
			/>
		</svg>
	)
}
