import { Invoice as IInvoice } from '@/types/invoice'
import { formatDateTime } from '@/utils/others'
import { ArrowUpRightFromSquare, CalendarIcon, ClockIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CardContent } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

export interface InvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
	invoice: IInvoice
}

export function InvoiceCard({
	invoice,
	className,
	...props
}: InvoiceCardProps) {
	const invoiceUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoice.id}`
	return (
		<Card className={cn('w-full max-w-3xl', className)} {...props}>
			<CardHeader className="flex flex-col gap-4 border-b border-slate-200">
				<CardTitle>Invoice #{invoice.id}</CardTitle>
				<CardDescription className="flex flex-col justify-between gap-4 sm:flex-row">
					<div className="flex flex-col gap-2">
						<div className="flex items-center space-x-1 text-xs text-slate-400">
							<CalendarIcon className="h-4 w-4" />
							<span>Issued at: {formatDateTime(invoice.created_at)}</span>
						</div>
						<div className="flex items-center space-x-1 text-xs text-slate-400">
							<ClockIcon className="h-4 w-4" />
							<span>Expires at: {formatDateTime(invoice.expires_at)}</span>
						</div>
						<div className="flex items-center space-x-1 text-xs text-slate-400">
							<ClockIcon className="h-4 w-4" />
							<span>Status: {invoice.status}</span>
						</div>
					</div>
					<div>
						<h3 className="text-xs text-slate-600">Amount Payable</h3>
						<p className="text-2xl font-semibold text-slate-800">
							Ӿ {invoice.price}
						</p>
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-4">
					<div>
						<h1 className="text-xl font-semibold text-slate-600">
							{invoice.title}
						</h1>
						<p className="text-sm text-slate-500">{invoice.description}</p>
					</div>
					<div className="border-t border-slate-200 py-2">
						<h3 className="w-full text-left text-sm font-semibold text-slate-600">
							Payment Link:
						</h3>
						<Link
							href={invoiceUrl}
							target="_blank"
							className="flex items-center space-x-1 text-xs text-sky-600"
						>
							<span>{invoiceUrl}</span>
							<ArrowUpRightFromSquare className="h-3 w-3" />
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
