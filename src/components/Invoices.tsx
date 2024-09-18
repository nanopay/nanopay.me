import { Invoice, InvoiceStatus } from '@/core/client'
import { formatDateTime } from '@/utils/others'
import clsx from 'clsx'
import { BanknoteIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { NavPagination, NavPaginationMobile } from './NavPagination'
import EmptySvg from '@/images/empty.svg'
import Image from 'next/image'

const statusStyles: Record<InvoiceStatus, string> = {
	paid: 'bg-green-100 text-green-800',
	pending: 'bg-yellow-100 text-yellow-800',
	expired: 'bg-red-100 text-red-800',
	error: 'bg-red-600 text-white',
}

interface InvoicesProps {
	invoices: Invoice[]
	count: number
	offset: number
	limit: number
	serviceIdOrSlug: string
	showPagination?: boolean
}

export default async function Invoices({
	invoices,
	count,
	offset,
	limit,
	serviceIdOrSlug,
	showPagination = true,
}: InvoicesProps) {
	const from = invoices.length > 0 ? offset + 1 : 0
	const to = invoices.length + offset

	if (count === 0) {
		return (
			<div className="border-slate flex flex-col items-center justify-center gap-3 rounded-md border bg-white px-4 py-6">
				<p className="text-xl font-bold text-slate-700">No Invoice Found</p>
				<Image src={EmptySvg} alt="Empty" className="h-48" />
			</div>
		)
	}

	return (
		<>
			{/* Activity list (smallest breakpoint only) */}
			<div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 sm:hidden">
				<ul
					role="list"
					className="mt-2 divide-y divide-slate-200 overflow-hidden shadow sm:hidden"
				>
					{invoices?.map(invoice => (
						<li key={invoice.id}>
							<a
								href={`/invoices/${invoice.id}`}
								className="block bg-white px-4 py-4 hover:bg-slate-100"
							>
								<span className="flex items-center space-x-4">
									<span className="flex flex-1 space-x-2 truncate">
										<BanknoteIcon
											className="h-5 w-5 flex-shrink-0 text-slate-400"
											aria-hidden="true"
										/>
										<span className="flex flex-col truncate text-sm text-slate-500">
											<span className="truncate">{invoice.title}</span>
											<span>
												<span className="font-medium text-slate-900">
													{invoice.price}
												</span>{' '}
												{invoice.currency}
											</span>
											<time dateTime={invoice.created_at}>
												{formatDateTime(invoice.created_at)}
											</time>
										</span>
									</span>
									<ChevronRightIcon
										className="h-5 w-5 flex-shrink-0 text-slate-400"
										aria-hidden="true"
									/>
								</span>
							</a>
						</li>
					))}
				</ul>
				<NavPaginationMobile count={count} from={from} to={to} limit={limit} />
			</div>

			{/* Activity table (small breakpoint and up) */}
			<div className="hidden sm:block">
				<div className="mx-auto max-w-7xl">
					<div className="mt-2 flex flex-col">
						<div className="min-w-full overflow-hidden overflow-x-auto rounded-lg border border-slate-200 align-middle">
							<table className="min-w-full divide-y divide-slate-200">
								<thead>
									<tr>
										<th
											className="bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900"
											scope="col"
										>
											Title
										</th>
										<th
											className="bg-slate-100 px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											Amount
										</th>
										<th
											className="hidden bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900 md:block"
											scope="col"
										>
											Status
										</th>
										<th
											className="bg-slate-100 px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											Date
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 bg-white">
									{invoices?.map(invoice => (
										<tr key={invoice.id} className="bg-white">
											<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-slate-900">
												<div className="flex">
													<Link
														href={
															serviceIdOrSlug
																? `/${serviceIdOrSlug}/invoices/${invoice.id}`
																: `/invoices/${invoice.id}`
														}
														className="group inline-flex space-x-2 truncate text-sm"
													>
														<BanknoteIcon
															className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
															aria-hidden="true"
														/>
														<p className="truncate text-slate-500 group-hover:text-slate-900">
															{invoice.title}
														</p>
													</Link>
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<span className="font-medium text-slate-900">
													{invoice.price}
												</span>{' '}
												{invoice.currency}
											</td>
											<td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-500 md:block">
												<span
													className={clsx(
														statusStyles[invoice.status],
														'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
													)}
												>
													{invoice.status}
												</span>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<time dateTime={invoice.created_at}>
													{formatDateTime(invoice.created_at)}
												</time>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{showPagination && (
								<NavPagination
									count={count}
									from={from}
									to={to}
									limit={limit}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
