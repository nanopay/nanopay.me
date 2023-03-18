import {
	ArrowPathIcon,
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
	toFiatCurrency,
	truncateAddress,
} from '@/utils/others'
import Countdown from 'react-countdown'
import { convert, Unit } from 'nanocurrency'

interface CheckoutProps {
	invoiceId: string | number
	address: string
	amount: number
	usd: number
	paid: boolean
	expiresAt: Date
}

export default function Checkout({
	invoiceId,
	address,
	amount,
	usd,
	paid,
	expiresAt,
}: CheckoutProps) {
	amount
	const payURI = `nano:${address}?amount=${convert(amount.toString(), {
		from: Unit.Nano,
		to: Unit.raw,
	})}`

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
			<div className="flex flex-col flex-1 px-4 py-2">
				<div className="flex justify-between items-center my-2 pb-2">
					<div className="flex gap-2 items-center sm:hidden">
						<QrCodeIcon className="w-5 h-5 text-slate-400" />
						<div className="text-xs font-semibold text-slate-500">Scan QR</div>
					</div>
					<div className="hidden sm:flex items-center text-xs gap-2 text-gray-600">
						<div className="animate-spin border border-t-2 border-nano/40 border-t-nano rounded-full w-4 h-4" />
						<span className="animate-pulse">Waiting for Payment</span>
					</div>
					<button className="text-xs flex gap-1 text-slate-500">
						<ArrowPathIcon className="w-4 h-4 text-slate-400" />
						Refresh
					</button>
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
										className="w-8 h-auto"
										unoptimized
									/>
									<div className="flex gap-1">
										<div className="text-2xl font-semibold">{amount}</div>
									</div>
								</>
							) : (
								<div className="flex gap-1">
									<Image
										src={logoXno}
										alt="nano-xno"
										className="w-7 h-auto"
										unoptimized
									/>
									<div className="text-2xl font-semibold">{amount}</div>
								</div>
							)}
							{usd && (
								<div className="text-xs text-gray-500">
									~ US${toFiatCurrency(usd)}
								</div>
							)}
						</div>

						<div className="py-4">
							<div className="flex gap-2 justify-between items-center mt-4 py-2 border-y border-gray-100 text-sm text-gray-500">
								<div>Send to:</div>
								<div>{truncateAddress(address)}</div>
								<button
									onClick={() => copyToClipboard(address)}
									className="text-slate-400 focus:text-nano"
								>
									<DocumentDuplicateIcon className="w-4 h-4" />
								</button>
							</div>

							<div className="flex gap-2 justify-center items-center py-4 mb-4 text-xs text-gray-500 sm:hidden border-b border-gray-100">
								<div className="animate-spin border border-t-2 border-nano/40 border-t-nano rounded-full w-4 h-4" />
								Waiting for Payment
							</div>

							<div className="mt-3 divide-y divide-gray-100 text-sm">
								<div className="flex justify-between py-1">
									<div className="text-gray-500">Expires in</div>
									<Countdown
										date={expiresAt}
										renderer={props => (
											<div className="font-medium text-gray-900">
												{props.minutes}:{props.seconds}
											</div>
										)}
									/>
								</div>
								<div className="flex justify-between py-1">
									<div className="text-gray-500">Invoice</div>
									<div className="font-medium text-gray-900">#{invoiceId}</div>
								</div>
							</div>
							<div className="flex justify-center mt-6">
								<MButton
									className="w-full sm:w-auto"
									endIcon={
										<ArrowTopRightOnSquareIcon className="w-4 h-4 -mt-1" />
									}
									href={payURI}
								>
									Open in Wallet
								</MButton>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex sm:mt-6 gap-2 text-2xs px-4 border-t border-gray-100 py-3 text-gray-400 justify-between items-center text-center">
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
			</div>
		</div>
	)
}
