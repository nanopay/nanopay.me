import { Logo } from './Logo'
import logoXno from '@/images/logos/nano-xno.svg'
import Image from 'next/image'
import Link from 'next/link'
import QrCodeBorder from './QrCodeBorder'
import QRCode from 'react-qr-code'
import {
	copyToClipboard,
	formatDateTime,
	toFiatCurrency,
	truncateAddress,
} from '@/utils/others'
import Countdown from 'react-countdown'
import { convert, Unit } from 'nanocurrency'
import { useEffect, useState } from 'react'
import { Payment } from '@/types/payment'
import { Service } from '@/types/services'
import Transactions from './Transactions'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from '@mui/material'
import DefaultAvatar from './DefaultAvatar'
import {
	AlertCircleIcon,
	ArrowDownToLine,
	ChevronDownIcon,
	CopyIcon,
	ExternalLinkIcon,
	QrCodeIcon,
} from 'lucide-react'
import clsx from 'clsx'
import { Button } from './Button'
import { REFUND_EMAIL, SUPPORT_EMAIL } from '@/constants'

interface CheckoutProps {
	invoiceId: string | number
	title: string
	description?: string
	address: string
	amount: number
	usd: number
	expiresAt: Date
	payments: Payment[]
	service: Omit<Service, 'api_keys_count'>
	redirectUrl?: string
}

export default function Checkout({
	invoiceId,
	title,
	description,
	address,
	amount,
	usd,
	payments,
	expiresAt,
	service,
	redirectUrl,
}: CheckoutProps) {
	const [rendered, setRendered] = useState(false)

	useEffect(() => {
		setRendered(true)
	}, [])

	const lastPayment = payments[payments.length - 1]

	const amountPaid = payments.reduce((acc, curr) => acc + curr.amount, 0)

	// if transactions amount sum is equal or greater than price, it's paid
	const paid = amountPaid >= amount

	const partiallyPaid = !paid && amountPaid > 0

	const missingAmount = amount - amountPaid

	const payURI = `nano:${address}?amount=${convert(missingAmount.toString(), {
		from: Unit.Nano,
		to: Unit.raw,
	})}`

	const isExpired =
		!paid && new Date(expiresAt).getTime() - new Date().getTime() < 0

	return (
		<div className="flex w-full flex-col rounded-3xl shadow md:flex-row">
			<nav className="hidden w-72 flex-col items-center justify-between gap-16 border-r border-[#1e2c3d] bg-[#1e2c3d] px-4 py-2 sm:rounded-l-3xl md:flex">
				<div className="hidden md:block">
					<div className="mt-4 flex flex-col items-center gap-2 p-4 text-white">
						{service.avatar_url ? (
							<Image
								alt={service.name}
								src={service.avatar_url}
								width={64}
								height={64}
								className="rounded-full border-2 border-slate-400 bg-white"
							/>
						) : (
							<DefaultAvatar name={service.display_name} />
						)}
						<h2 className="text-lg font-semibold">{service.display_name}</h2>
					</div>
					<div className="h-1/2 overflow-y-auto">
						<div className="mt-8 p-4 text-white">
							<h2 className="pb-2 font-semibold">{title}</h2>
							<p className="mt-2 text-sm">{description || 'No description'}</p>
						</div>
					</div>
				</div>

				<div className="w-48 p-4">
					<a
						href={process.env.NEXT_PUBLIC_BASE_URL}
						target="_blank"
						className="flex flex-col text-slate-200"
					>
						<span className="text-xs font-semibold">Powered by</span>
						<Logo className="h-auto w-full" theme="dark" />
					</a>
				</div>
			</nav>

			<nav className="flex w-full justify-center bg-slate-700 px-4 py-2 md:hidden">
				<Logo className="h-auto w-32" theme="dark" />
			</nav>

			<Accordion
				square
				elevation={0}
				className="border-b border-slate-200 md:hidden"
			>
				<AccordionSummary
					expandIcon={<ChevronDownIcon className="h-5 w-5 text-slate-700" />}
				>
					<Typography className="flex items-center gap-2">
						{service.avatar_url ? (
							<Image
								alt={service.name}
								src={service.avatar_url}
								width={40}
								height={40}
								className="rounded-full border-2 border-slate-400 bg-white"
							/>
						) : (
							<Logo className="h-auto w-32" theme="dark" />
						)}
						<div className="ml-2 w-full">
							<h2 className="text-lg font-semibold leading-5">
								{service.display_name}
							</h2>
							<p className="text-sm">{title}</p>
						</div>
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						<p className="text-sm">{description || 'No description'}</p>
					</Typography>
				</AccordionDetails>
			</Accordion>

			<main className="flex flex-1 flex-col rounded-r-3xl bg-white px-4 py-2">
				{isExpired ? (
					<>
						<div className="flex flex-1 items-center justify-center py-4">
							<div className="flex flex-col items-center gap-2">
								<svg
									width="115px"
									height="115px"
									viewBox="0 0 133 133"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
								>
									<g
										id="x-group"
										stroke="none"
										stroke-width="1"
										fill="none"
										fill-rule="evenodd"
									>
										<circle
											id="filled-circle"
											fill="#be123c"
											cx="66.5"
											cy="66.5"
											r="54.5"
										/>
										<circle
											id="white-circle"
											fill="#FFFFFF"
											cx="66.5"
											cy="66.5"
											r="55.5"
										/>
										<circle
											id="outline"
											stroke="#be123c"
											stroke-width="4"
											cx="66.5"
											cy="66.5"
											r="54.5"
										/>
										<line
											id="x-line-1"
											stroke="#FFFFFF"
											stroke-width="5.5"
											x1="41"
											y1="41"
											x2="92"
											y2="92"
										/>
										<line
											id="x-line-2"
											stroke="#FFFFFF"
											stroke-width="5.5"
											x1="41"
											y1="92"
											x2="92"
											y2="41"
										/>
									</g>
								</svg>
								<h3 className="text-xl font-semibold text-slate-600">
									Expired
								</h3>
								{amountPaid > 0 && (
									<div className="mt-4 flex flex-col gap-1">
										<Link
											href={`mailto:${REFUND_EMAIL}?subject=Refund to Invoice #${invoiceId}&body=Please refund me the amount of Ӿ${amountPaid} to the following address: <YOUR_ADDRESS_HERE>`}
										>
											<Button
												variant="ghost"
												className="PayButton w-full sm:w-auto"
											>
												Refund Ӿ{amountPaid}
												<ReceiptRefundIcon className="ml-2 h-4 w-4" />
											</Button>
										</Link>
									</div>
								)}
							</div>
						</div>

						<div className="sm:px-4">
							<div className="flex justify-between border-y border-dashed border-slate-200 py-2 text-sm">
								<div className="text-slate-500">Invoice</div>
								<div className="font-medium text-slate-900">#{invoiceId}</div>
							</div>
							<div className="flex justify-between border-b border-dashed border-slate-200 py-2 text-sm">
								<div className="text-slate-500">Expired At</div>
								{formatDateTime(expiresAt.toDateString())}
							</div>

							{payments.length && (
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
				) : paid ? (
					<>
						<div className="flex flex-1 items-center justify-center py-4">
							<div className="flex flex-col items-center gap-2">
								<svg
									width="115px"
									height="115px"
									viewBox="0 0 133 133"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
								>
									<g
										id="check-group"
										stroke="none"
										stroke-width="1"
										fill="none"
										fill-rule="evenodd"
									>
										<circle
											id="filled-circle"
											fill="#07b481"
											cx="66.5"
											cy="66.5"
											r="54.5"
										/>
										<circle
											id="white-circle"
											fill="#FFFFFF"
											cx="66.5"
											cy="66.5"
											r="55.5"
										/>
										<circle
											id="outline"
											stroke="#07b481"
											stroke-width="4"
											cx="66.5"
											cy="66.5"
											r="54.5"
										/>
										<polyline
											id="check"
											stroke="#FFFFFF"
											stroke-width="5.5"
											points="41 70 56 85 92 49"
										/>
									</g>
								</svg>
								<h3 className="text-xl font-semibold text-slate-600">
									Paid Ӿ{amountPaid}
								</h3>
								{usd && (
									<div className="text-sm leading-3 text-slate-500 sm:text-xs">
										~ US${toFiatCurrency(usd)}
									</div>
								)}
								<div className="mt-4 flex flex-col gap-1">
									<Link href={'#'}>
										<Button
											variant="ghost"
											className="PayButton w-full sm:w-auto"
										>
											Get Receipt
											<ArrowDownToLine className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								</div>
							</div>
						</div>

						{redirectUrl && (
							<div className="flex justify-center py-4">
								<a href={redirectUrl} target="_blank">
									<Button className="PayButton w-full sm:w-auto">
										Continue to {service?.name || 'Merchant Site'}
										<ExternalLinkIcon className="ml-2 h-4 w-4" />
									</Button>
								</a>
							</div>
						)}

						<div className="sm:px-4">
							<div className="flex justify-between border-y border-dashed border-slate-200 py-2 text-sm">
								<div className="text-slate-500">Invoice</div>
								<div className="font-medium text-slate-900">#{invoiceId}</div>
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
				) : (
					<>
						{partiallyPaid && (
							<div className="my-2 w-full rounded border border-yellow-300 bg-yellow-100 px-4 py-2 text-yellow-800">
								<div className="flex items-center gap-2">
									<AlertCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
									<h3 className="font-semibold sm:text-lg">Partially Paid</h3>
								</div>
								<p className="mt-1 text-xs sm:text-sm">
									You have paid Ӿ{amountPaid} of Ӿ{amount}. Pay the missing
									amount Ӿ{missingAmount}
								</p>
							</div>
						)}
						<div className="my-2 flex items-center justify-between pb-2 md:hidden">
							<div className="flex items-center gap-2 sm:hidden">
								<QrCodeIcon className="h-5 w-5 text-slate-400" />
								<div className="text-xs font-semibold text-slate-500">
									Scan QR
								</div>
							</div>
							<div className="hidden sm:block" />
							<div className="flex items-center justify-center gap-2 text-xs text-slate-500">
								<div className="border-nano/40 border-t-nano h-4 w-4 animate-spin rounded-full border border-t-2" />
								<div className="flex gap-2">
									Expires in:
									{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
									{rendered && (
										<Countdown
											date={expiresAt}
											zeroPadTime={2}
											renderer={props => (
												<div className="font-medium text-slate-900">
													{props.minutes}:{props.seconds}
												</div>
											)}
										/>
									)}
								</div>
							</div>
						</div>
						<div className="py-4 sm:px-4">
							<div className="flex flex-1 flex-col md:flex-row">
								<div className="hidden justify-center border-r border-slate-100 pr-12 md:flex">
									<div className="relative flex w-40 flex-none items-center justify-center lg:w-48">
										<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
										<QRCode
											value={payURI}
											fgColor="#1e293b"
											className="w-3/4"
										/>
									</div>
								</div>
								<div className="flex flex-1 flex-col items-center justify-center">
									<div className="flex flex-col items-center justify-center gap-1 py-2 text-slate-800 sm:py-4">
										{missingAmount.toString().length > 2 ? (
											<>
												<Image
													src={logoXno}
													alt="nano-xno"
													className="h-auto w-12 sm:w-8"
													unoptimized
												/>
												<div className="flex gap-1">
													<div className="text-3xl font-semibold sm:text-2xl">
														{missingAmount}
													</div>
												</div>
											</>
										) : (
											<div className="flex gap-1">
												<Image
													src={logoXno}
													alt="nano-xno"
													className="h-auto w-9 sm:w-7"
													unoptimized
												/>
												<div className="text-3xl font-semibold sm:text-2xl">
													{missingAmount}
												</div>
											</div>
										)}
										{usd && (
											<div className="text-sm leading-3 text-slate-500 sm:text-xs">
												~ US${toFiatCurrency(usd)}
											</div>
										)}
									</div>

									<div className="hidden items-center justify-center gap-2 py-4 text-xs text-slate-500 sm:flex">
										<div className="border-nano/40 border-t-nano h-4 w-4 animate-spin rounded-full border border-t-2" />
										<div className="flex gap-2">
											Expires in:
											{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
											{rendered && (
												<Countdown
													date={expiresAt}
													zeroPadTime={2}
													renderer={props => (
														<div className="font-medium text-slate-900">
															{props.minutes}:{props.seconds}
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
								<div>{truncateAddress(address)}</div>
								<button
									onClick={() => copyToClipboard(address)}
									className="focus:text-nano text-slate-400"
								>
									<CopyIcon className="h-4 w-4" />
								</button>
							</div>

							<div className="text-sm">
								<div className="flex justify-between border-b border-dashed border-slate-200 py-2">
									<div className="text-slate-500">Invoice</div>
									<div className="font-medium text-slate-900">#{invoiceId}</div>
								</div>
							</div>
							<div className="mt-6 flex justify-center">
								<Link href={payURI}>
									<Button className="PayButton w-full sm:w-auto">
										Open Wallet
										<ExternalLinkIcon className="ml-2 h-4 w-4" />
									</Button>
								</Link>
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

				<footer className="text-2xs flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-center text-slate-400 sm:mt-6">
					<Link href="/terms" className="hover:text-nano flex-1">
						Terms of Service
					</Link>
					<div className="mx-2 text-slate-100">|</div>
					<Link href="/privacy" className="hover:text-nano flex-1">
						Privacy Policy
					</Link>
					<div className="mx-2 text-slate-100">|</div>
					<Link
						href={`mailto:${SUPPORT_EMAIL}`}
						className="hover:text-nano flex-1"
					>
						{SUPPORT_EMAIL}
					</Link>
				</footer>
			</main>
		</div>
	)
}

function ReceiptRefundIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			className={clsx('h-6 w-6', props.className)}
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
			/>
		</svg>
	)
}
