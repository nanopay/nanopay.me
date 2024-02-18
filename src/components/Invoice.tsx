import { Invoice as IInvoice } from '@/types/invoice'
import { formatDateTime } from '@/utils/others'
import clsx from 'clsx'
import Image from 'next/image'
import QRCode from 'react-qr-code'
import { Logo } from './Logo'
import MButton from './MButton'
import QrCodeBorder from './QrCodeBorder'
import {
	ArrowUpRightFromSquare,
	CalendarIcon,
	ClockIcon,
	PrinterIcon,
} from 'lucide-react'
import { Button } from './Button'

interface InvoiceProps {
	className?: string
	invoice: IInvoice
}

export default function Invoice({ className, invoice }: InvoiceProps) {
	const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoice.id}`

	return (
		<div
			className={clsx(
				'flex min-h-[512px] flex-1 flex-col rounded-lg border border-slate-200 bg-slate-600',
				className,
			)}
		>
			<div className="w-full rounded-t-lg px-4">
				<div className="flex items-center justify-between">
					<Logo className="w-32" theme="dark" />
					<div className="flex flex-col items-end">
						<h1 className="text-xl leading-5 text-white">Invoice</h1>
						<span className="text-xs text-white">#{invoice.id}</span>
					</div>
				</div>
				<ul className="flex items-center justify-between border-t border-slate-500 py-4 pb-2">
					<li>
						<div className="flex space-x-1 uppercase">
							<CalendarIcon className="h-4 w-4 text-white" />
							<span className="text-xs text-white">Issued at</span>
						</div>
						<div className="text-xs font-semibold text-white">
							{formatDateTime(invoice.created_at)}
						</div>
					</li>
					<li>
						<div className="flex space-x-1 uppercase">
							<ClockIcon className="h-4 w-4 text-white" />
							<span className="text-xs text-white">Expires at</span>
						</div>
						<div className="text-xs font-semibold text-white">
							{formatDateTime(invoice.expires_at)}
						</div>
					</li>
				</ul>
			</div>
			<div className="flex-1 bg-white px-4">
				<div className="flex h-20 w-full justify-between border-b border-slate-200 py-4">
					<div>
						<h3 className="mb-1 text-xs font-semibold text-slate-500">
							Merchant:
						</h3>
						<div className="flex space-x-2">
							<Image
								src={invoice.service.avatar_url || ''}
								width={28}
								height={28}
								className="rounded-full"
								alt="service logo"
							/>
							<p className="text-xl font-semibold">{invoice.service.name}</p>
						</div>
					</div>
					<div>
						<h3 className="mb-1 text-xs font-semibold text-slate-500">
							Status:
						</h3>
						<p className="text-xl font-semibold capitalize text-sky-600">
							{invoice.status}
						</p>
					</div>
				</div>
				<div className="flex w-full flex-1 flex-col justify-between space-x-4 divide-x divide-slate-200 px-4 py-8 sm:flex-row">
					<div>
						<h1 className="text-md font-semibold text-slate-600">
							{invoice.title}
						</h1>
						<p className="text-xs text-slate-500">{invoice.description}</p>
					</div>
					<div className="flex flex-col items-center px-8">
						<h3 className="mb-4 w-full text-left text-xs text-slate-600">
							Go to Checkout:
						</h3>
						<div className="relative flex h-24 w-24 flex-none items-center justify-center">
							<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
							<QRCode value={invoiceUrl} fgColor="#1e293b" className="w-4/5" />
						</div>
						{/* Use z-index to make sure the link is clickable. Otherwise QRCode svg can conver it */}
						<div className="z-10">
							<a href={invoiceUrl} target="_blank">
								<div className="mt-4 flex items-center space-x-1 text-xs text-sky-600">
									<span>{invoiceUrl}</span>
									<ArrowUpRightFromSquare className="h-3 w-3" />
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full items-center justify-between bg-slate-100 px-8 py-4">
				<Button size="sm">
					<PrinterIcon className="mr-1.5 h-4 w-4" />
					Print
				</Button>
				<div>
					<h3 className="text-xs text-slate-600">Amount Payable</h3>
					<p className="text-2xl font-semibold text-slate-800">
						Ӿ {invoice.price}
					</p>
				</div>
			</div>
		</div>
	)
}
