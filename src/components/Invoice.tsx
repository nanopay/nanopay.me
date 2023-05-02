import { Invoice as IInvoice } from '@/types/invoice'
import { formatDateTime } from '@/utils/others'
import {
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
	ClockIcon,
	PrinterIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Image from 'next/image'
import QRCode from 'react-qr-code'
import { Logo } from './Logo'
import MButton from './MButton'
import QrCodeBorder from './QrCodeBorder'

interface InvoiceProps {
	className?: string
	invoice: IInvoice
}

export default function Invoice({ className, invoice }: InvoiceProps) {
	const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoice.id}`

	return (
		<div
			className={clsx(
				'min-h-[512px] flex flex-col flex-1 rounded-lg bg-slate-600 border border-slate-200',
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
				<ul className="flex items-center justify-between pb-2 border-t border-slate-500 py-4">
					<li>
						<div className="flex uppercase space-x-1">
							<CalendarIcon className="w-4 h-4 text-white" />
							<span className="text-xs text-white">Issued at</span>
						</div>
						<div className="text-white font-semibold text-xs">
							{formatDateTime(invoice.created_at)}
						</div>
					</li>
					<li>
						<div className="flex uppercase space-x-1">
							<ClockIcon className="w-4 h-4 text-white" />
							<span className="text-xs text-white">Expires at</span>
						</div>
						<div className="text-white font-semibold text-xs">
							{formatDateTime(invoice.expires_at)}
						</div>
					</li>
				</ul>
			</div>
			<div className="px-4 flex-1 bg-white">
				<div className="w-full flex justify-between h-20 py-4 border-b border-slate-200">
					<div>
						<h3 className="text-xs text-gray-500 mb-1 font-semibold">
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
						<h3 className="text-xs text-gray-500 mb-1 font-semibold">
							Status:
						</h3>
						<p className="text-xl font-semibold text-sky-600 capitalize">
							{invoice.status}
						</p>
					</div>
				</div>
				<div className="w-full flex-1 py-8 px-4 flex flex-col sm:flex-row space-x-4 justify-between divide-x divide-slate-200">
					<div>
						<h1 className="text-md font-semibold text-gray-600">
							{invoice.title}
						</h1>
						<p className="text-xs text-gray-500">{invoice.description}</p>
					</div>
					<div className="flex flex-col items-center px-8">
						<h3 className="w-full text-left text-xs text-gray-600 mb-4">
							Go to Checkout:
						</h3>
						<div className="relative flex flex-none items-center justify-center w-24 h-24">
							<QrCodeBorder className="absolute inset-0 h-full w-full stroke-slate-300" />
							<QRCode value={invoiceUrl} fgColor="#1e293b" className="w-4/5" />
						</div>
						{/* Use z-index to make sure the link is clickable. Otherwise QRCode svg can conver it */}
						<div className="z-10">
							<a href={invoiceUrl} target="_blank">
								<div className="flex items-center text-xs space-x-1 text-sky-600 mt-4">
									<span>{invoiceUrl}</span>
									<ArrowTopRightOnSquareIcon className="w-3 h-3" />
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full flex px-8 py-4 bg-slate-100 justify-between items-center">
				<MButton size="small" startIcon={<PrinterIcon className="w-4 h-4" />}>
					Print
				</MButton>
				<div>
					<h3 className="text-xs text-gray-600">Amount Payable</h3>
					<p className="text-2xl font-semibold text-gray-800">
						Ӿ {invoice.price}
					</p>
				</div>
			</div>
		</div>
	)
}
