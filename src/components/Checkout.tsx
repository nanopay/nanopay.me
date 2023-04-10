import {
	ArrowDownTrayIcon,
	ArrowTopRightOnSquareIcon,
	DocumentDuplicateIcon,
	QrCodeIcon,
	XCircleIcon,
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
	formatDateTime,
	toFiatCurrency,
	truncateAddress,
} from '@/utils/others'
import Countdown from 'react-countdown'
import { convert, Unit } from 'nanocurrency'
import { useEffect, useState } from 'react'
import { Payment } from '@/types/payment'
import { Service } from '@/types/services'

interface CheckoutProps {
	invoiceId: string | number
	address: string
	amount: number
	usd: number
	expiresAt: Date
	paid: boolean
	payments: Payment[]
	service: Omit<Service, 'api_keys_count'>
	redirectUrl?: string
}

export default function Checkout({
	invoiceId,
	address,
	amount,
	usd,
	paid,
	payments,
	expiresAt,
	service,
	redirectUrl,
}: CheckoutProps) {
	const [rendered, setRendered] = useState(false)

	useEffect(() => {
		setRendered(true)
	}, [])

	const payURI = `nano:${address}?amount=${convert(amount.toString(), {
		from: Unit.Nano,
		to: Unit.raw,
	})}`

	const payment = payments[0]

	return (
		<div className="w-full flex flex-col bg-white rounded-lg shadow">
			<nav className="flex gap-2 justify-between items-center bg-slate-700 sm:rounded-t-lg py-2 px-4">
				<a
					href={process.env.NEXT_PUBLIC_BASE_URL}
					target="_blank"
					className="flex gap-2 items-center"
				>
					<Logo className="w-32 h-auto" theme="dark" />
				</a>
				<button className="text-slate-400 hover:text-rose-400">
					<XCircleIcon className="w-6 h-6" />
				</button>
			</nav>

			{paid ? (
				<main className="flex flex-col flex-1 px-4 py-2">
					<div className="flex justify-between items-center my-2 pb-2">
						<div>
							<MButton
								variant="text"
								className="w-full sm:w-auto PayButton"
								endIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
								href={payURI}
							>
								Explorer
							</MButton>
						</div>
						<div>
							<MButton
								variant="text"
								className="w-full sm:w-auto PayButton"
								endIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
								href={payURI}
							>
								Download Invoice
							</MButton>
						</div>
					</div>
					<div className="flex flex-col flex-1 sm:flex-row">
						<div className="hidden sm:flex flex-1 justify-center items-center border-r border-slate-100">
							<div className="relative flex w-full flex-none items-center justify-center">
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
										Paid Ӿ{0.0001}
									</h3>
									<div className="mt-4 flex flex-col gap-1">
										<MButton
											variant="text"
											className="w-full sm:w-auto PayButton"
											endIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
											href={payURI}
										>
											Download Invoice
										</MButton>
										<MButton
											variant="text"
											className="w-full sm:w-auto PayButton"
											endIcon={
												<ArrowTopRightOnSquareIcon className="w-4 h-4" />
											}
											href={payURI}
										>
											See on Explorer
										</MButton>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col flex-1 sm:px-8 justify-center">
							<div className="flex flex-col items-center justify-center gap-1 text-gray-800 py-2 sm:py-4 flex-1 sm:hidden">
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
								<h3 className="text-xl font-semibold text-gray-900">
									Paid Ӿ{0.0001}
								</h3>
								{usd && (
									<div className="text-sm sm:text-xs text-gray-500 leading-3">
										~ US${toFiatCurrency(usd)}
									</div>
								)}
							</div>

							<div className="py-4">
								<div className="flex justify-between py-2 border-y border-slate-200 border-dashed text-sm">
									<div className="text-gray-500">Invoice</div>
									<div className="font-medium text-gray-900">#{invoiceId}</div>
								</div>
								<div className="flex justify-between py-2 border-b border-slate-200 border-dashed text-sm">
									<div className="text-gray-500">Paid at</div>
									{formatDateTime(payment.timestamp)}
								</div>
								<div className="flex justify-between py-2 border-b border-slate-200 border-dashed text-sm">
									<div className="text-gray-500">From</div>
									<div>{truncateAddress(payment.from)}</div>
								</div>
								<div className="flex justify-between py-2 border-b border-slate-200 border-dashed text-sm">
									<div className="text-gray-500">Hash</div>
									<div>{truncateAddress(payment.hash)}</div>
									<button
										onClick={() => copyToClipboard(payment.hash)}
										className="text-slate-400 focus:text-nano"
									>
										<DocumentDuplicateIcon className="w-4 h-4" />
									</button>
								</div>
								{redirectUrl && (
									<div className="flex justify-center mt-6">
										<MButton
											className="w-full sm:w-auto PayButton"
											endIcon={
												<ArrowTopRightOnSquareIcon className="w-4 h-4" />
											}
											href={redirectUrl}
										>
											Continue to {service?.name || 'Merchant Site'}
										</MButton>
									</div>
								)}
							</div>
						</div>
					</div>
				</main>
			) : (
				<main className="flex flex-col flex-1 px-4 py-2">
					<div className="flex justify-between items-center my-2 pb-2">
						<div className="flex gap-2 items-center sm:hidden">
							<QrCodeIcon className="w-5 h-5 text-slate-400" />
							<div className="text-xs font-semibold text-slate-500">
								Scan QR
							</div>
						</div>
						<div className="hidden sm:block" />
						<div className="flex gap-2 justify-center items-center text-xs text-gray-500">
							<div className="animate-spin border border-t-2 border-nano/40 border-t-nano rounded-full w-4 h-4" />
							<span className="animate-pulse">Waiting for Payment</span>
						</div>
					</div>
					<div className="flex flex-col flex-1 sm:flex-row">
						<div className="hidden sm:flex flex-1 justify-center items-center border-r border-slate-100">
							<div className="relative flex w-full flex-none items-center justify-center">
								<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
								<QRCode value={payURI} fgColor="#1e293b" className="w-7/12" />
							</div>
						</div>
						<div className="flex flex-col flex-1 sm:px-8">
							<div className="flex flex-col items-center justify-center gap-1 text-gray-800 py-2 sm:py-4 flex-1">
								{amount.toString().length > 2 ? (
									<>
										<Image
											src={logoXno}
											alt="nano-xno"
											className="w-12 sm:w-8 h-auto"
											unoptimized
										/>
										<div className="flex gap-1">
											<div className="text-3xl sm:text-2xl font-semibold">
												{amount}
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
											{amount}
										</div>
									</div>
								)}
								{usd && (
									<div className="text-sm sm:text-xs text-gray-500 leading-3">
										~ US${toFiatCurrency(usd)}
									</div>
								)}
							</div>

							<div className="py-4">
								<div className="flex gap-2 justify-between items-center mt-4 py-2 border-y border-slate-200 text-sm text-gray-500  border-dashed">
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
										<div className="text-gray-500">Expires in</div>

										{/* Avoid hydration error by not rendering the countdown until the component is mounted */}
										{rendered && (
											<Countdown
												date={expiresAt}
												renderer={props => (
													<div className="font-medium text-gray-900">
														{props.minutes}:{props.seconds}
													</div>
												)}
											/>
										)}
									</div>
									<div className="flex justify-between py-2 border-b border-slate-200 border-dashed">
										<div className="text-gray-500">Invoice</div>
										<div className="font-medium text-gray-900">
											#{invoiceId}
										</div>
									</div>
								</div>
								<div className="flex justify-center mt-6">
									<MButton
										className="w-full sm:w-auto PayButton"
										endIcon={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
										href={payURI}
									>
										Open in Wallet
									</MButton>
								</div>
							</div>
						</div>
					</div>
				</main>
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
		</div>
	)
}
