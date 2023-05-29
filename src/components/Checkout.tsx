import {
	ArrowDownTrayIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUpRightIcon,
	ChevronDoubleDownIcon,
	ChevronDownIcon,
	DocumentDuplicateIcon,
	ExclamationCircleIcon,
	PaperAirplaneIcon,
	QrCodeIcon,
	ReceiptRefundIcon,
} from '@heroicons/react/24/solid'
import { Logo } from './Logo'
import logoXno from '@/images/logos/nano-xno.svg'
import Image from 'next/image'
import Link from 'next/link'
import QrCodeBorder from './QrCodeBorder'
import MButton from './MButton'
import QRCode from 'react-qr-code'
import {
	copyToClipboard,
	formatDate,
	formatDateTime,
	formatTime,
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
		<div className="w-full flex flex-col md:flex-row rounded-3xl shadow">
			<nav className="hidden md:flex flex-col gap-16 bg-[#1e2c3d] justify-between items-center sm:rounded-l-3xl py-2 px-4 w-72 border-r border-[#1e2c3d]">
				<div className="hidden md:block">
					<div className="p-4 mt-4 text-white flex flex-col items-center gap-2">
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
					<div className="overflow-y-auto h-1/2">
						<div className="mt-8 p-4 text-white">
							<h2 className="font-semibold pb-2">{title}</h2>
							<p className="text-sm mt-2">{description || 'No description'}</p>
						</div>
					</div>
				</div>

				<div className="p-4 w-48">
					<a
						href={process.env.NEXT_PUBLIC_BASE_URL}
						target="_blank"
						className="flex flex-col text-gray-200"
					>
						<span className="text-xs font-semibold">Powered by</span>
						<Logo className="w-full h-auto" theme="dark" />
					</a>
				</div>
			</nav>

			<nav className="py-2 px-4 w-full flex justify-center md:hidden bg-slate-700">
				<Logo className="w-32 h-auto" theme="dark" />
			</nav>

			<Accordion
				square
				elevation={0}
				className="border-b border-slate-200 md:hidden"
			>
				<AccordionSummary
					expandIcon={<ChevronDownIcon className="text-slate-700 w-5 h-5" />}
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
							<Logo className="w-32 h-auto" theme="dark" />
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

			<main className="flex flex-col flex-1 px-4 py-2 bg-white rounded-r-3xl">
				{isExpired ? (
					<>
						<div className="flex flex-1 justify-center items-center py-4">
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
								<h3 className="text-xl font-semibold text-gray-600">Expired</h3>
								{amountPaid > 0 && (
									<div className="mt-4 flex flex-col gap-1">
										<MButton
											variant="text"
											className="w-full sm:w-auto PayButton"
											endIcon={<ReceiptRefundIcon className="w-4 h-4" />}
											href={`mailto:refund@nanopay.me?subject=Refund to Invoice #${invoiceId}&body=Please refund me the amount of Ӿ${amountPaid} to the following address: <YOUR_ADDRESS_HERE>`}
										>
											Refund Ӿ{amountPaid}{' '}
										</MButton>
									</div>
								)}
							</div>
						</div>

						<div className="sm:px-4">
							<div className="flex justify-between py-2 border-y border-slate-200 border-dashed text-sm">
								<div className="text-gray-500">Invoice</div>
								<div className="font-medium text-gray-900">#{invoiceId}</div>
							</div>
							<div className="flex justify-between py-2 border-b border-slate-200 border-dashed text-sm">
								<div className="text-gray-500">Expired At</div>
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
						<div className="flex flex-1 justify-center items-center py-4">
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
								<h3 className="text-xl font-semibold text-gray-600">
									Paid Ӿ{amountPaid}
								</h3>
								{usd && (
									<div className="text-sm sm:text-xs text-gray-500 leading-3">
										~ US${toFiatCurrency(usd)}
									</div>
								)}
								<div className="mt-4 flex flex-col gap-1">
									<MButton
										variant="text"
										className="w-full sm:w-auto PayButton"
										endIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
										href={'#'}
									>
										Get Receipt
									</MButton>
								</div>
							</div>
						</div>

						{redirectUrl && (
							<div className="flex py-4 justify-center">
								<a href={redirectUrl} target="_blank">
									<MButton
										className="w-full sm:w-auto PayButton"
										endIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
									>
										Continue to {service?.name || 'Merchant Site'}
									</MButton>
								</a>
							</div>
						)}

						<div className="sm:px-4">
							<div className="flex justify-between py-2 border-y border-slate-200 border-dashed text-sm">
								<div className="text-gray-500">Invoice</div>
								<div className="font-medium text-gray-900">#{invoiceId}</div>
							</div>
							<div className="flex justify-between py-2 border-b border-slate-200 border-dashed text-sm">
								<div className="text-gray-500">Paid At</div>
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
							<div className="w-full py-2 px-4 my-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">
								<div className="flex gap-2 items-center">
									<ExclamationCircleIcon className="w-5 sm:w-6 h-5 sm:h-6" />
									<h3 className="sm:text-lg font-semibold">Partially Paid</h3>
								</div>
								<p className="text-xs sm:text-sm mt-1">
									You have paid Ӿ{amountPaid} of Ӿ{amount}. Pay the missing
									amount Ӿ{missingAmount}
								</p>
							</div>
						)}
						<div className="flex justify-between items-center my-2 pb-2 md:hidden">
							<div className="flex gap-2 items-center sm:hidden">
								<QrCodeIcon className="w-5 h-5 text-slate-400" />
								<div className="text-xs font-semibold text-slate-500">
									Scan QR
								</div>
							</div>
							<div className="hidden sm:block" />
							<div className="flex gap-2 justify-center items-center text-xs text-gray-500">
								<div className="animate-spin border border-t-2 border-nano/40 border-t-nano rounded-full w-4 h-4" />
								<div className="flex gap-2">
									Expires in:
									{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
									{rendered && (
										<Countdown
											date={expiresAt}
											zeroPadTime={2}
											renderer={props => (
												<div className="font-medium text-gray-900">
													{props.minutes}:{props.seconds}
												</div>
											)}
										/>
									)}
								</div>
							</div>
						</div>
						<div className="sm:px-4 py-4">
							<div className="flex flex-col md:flex-row flex-1">
								<div className="hidden md:flex justify-center border-r border-slate-100 pr-12">
									<div className="relative flex flex-none items-center justify-center w-40 lg:w-48">
										<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
										<QRCode
											value={payURI}
											fgColor="#1e293b"
											className="w-3/4"
										/>
									</div>
								</div>
								<div className="flex flex-col flex-1 items-center justify-center">
									<div className="flex flex-col items-center justify-center gap-1 text-gray-800 py-2 sm:py-4">
										{missingAmount.toString().length > 2 ? (
											<>
												<Image
													src={logoXno}
													alt="nano-xno"
													className="w-12 sm:w-8 h-auto"
													unoptimized
												/>
												<div className="flex gap-1">
													<div className="text-3xl sm:text-2xl font-semibold">
														{missingAmount}
													</div>
												</div>
											</>
										) : (
											<div className="flex gap-1">
												<Image
													src={logoXno}
													alt="nano-xno"
													className="w-9 sm:w-7 h-auto"
													unoptimized
												/>
												<div className="text-3xl sm:text-2xl font-semibold">
													{missingAmount}
												</div>
											</div>
										)}
										{usd && (
											<div className="text-sm sm:text-xs text-gray-500 leading-3">
												~ US${toFiatCurrency(usd)}
											</div>
										)}
									</div>

									<div className="gap-2 justify-center items-center text-xs text-gray-500 hidden sm:flex py-4">
										<div className="animate-spin border border-t-2 border-nano/40 border-t-nano rounded-full w-4 h-4" />
										<div className="flex gap-2">
											Expires in:
											{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
											{rendered && (
												<Countdown
													date={expiresAt}
													zeroPadTime={2}
													renderer={props => (
														<div className="font-medium text-gray-900">
															{props.minutes}:{props.seconds}
														</div>
													)}
												/>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="flex gap-2 justify-between items-center mt-4 py-2 border-y border-slate-200 text-sm text-gray-500 border-dashed">
								<div>Send to:</div>
								<div>{truncateAddress(address)}</div>
								<button
									onClick={() => copyToClipboard(address)}
									className="text-slate-400 focus:text-nano"
								>
									<DocumentDuplicateIcon className="w-4 h-4" />
								</button>
							</div>

							<div className="text-sm">
								<div className="flex justify-between py-2 border-b border-slate-200 border-dashed">
									<div className="text-gray-500">Invoice</div>
									<div className="font-medium text-gray-900">#{invoiceId}</div>
								</div>
							</div>
							<div className="flex justify-center mt-6">
								<MButton
									className="w-full sm:w-auto PayButton"
									endIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
									href={payURI}
								>
									Open Wallet
								</MButton>
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

				<footer className="flex sm:mt-6 gap-2 text-2xs px-4 border-t border-slate-100 py-3 text-gray-400 justify-between items-center text-center">
					<Link href="/terms" className="flex-1 hover:text-nano">
						Terms of Service
					</Link>
					<div className="mx-2 text-gray-100">|</div>
					<Link href="/privacy" className="flex-1 hover:text-nano">
						Privacy Policy
					</Link>
					<div className="mx-2 text-gray-100">|</div>
					<Link
						href="mailto:support@nanopay.me"
						className="flex-1 hover:text-nano"
					>
						support@nanopay.me
					</Link>
				</footer>
			</main>
		</div>
	)
}
