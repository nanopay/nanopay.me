import Link from 'next/link'
import { explorerUrl, truncateAddress } from '@/utils/others'
import { ArrowRightLeftIcon, ChevronRightIcon } from 'lucide-react'

interface TransactionsProps {
	transactions: {
		hash: string
		amount: number
	}[]
	currency?: string
}

export default function Transactions({
	transactions,
	currency = 'XNO',
}: TransactionsProps) {
	return (
		<>
			{/* Activity list (smallest breakpoint only) */}
			<div className="sm:hidden">
				<ul
					role="list"
					className="mt-2 divide-y divide-slate-200 overflow-hidden sm:hidden"
				>
					{transactions?.map(tx => (
						<li key={tx.hash}>
							<a
								target="_blank"
								href={explorerUrl(tx.hash)}
								className="block bg-white py-3 hover:bg-slate-100"
							>
								<span className="flex items-center space-x-4">
									<span className="flex flex-1 space-x-2 truncate">
										<ArrowRightLeftIcon
											className="h-5 w-5 flex-shrink-0 text-slate-400"
											aria-hidden="true"
										/>
										<span className="flex w-full flex-wrap justify-between text-xs text-slate-500">
											<span className="truncate">
												{truncateAddress(tx.hash)}
											</span>
											<span>
												<span className="font-medium text-slate-900">
													{tx.amount}
												</span>{' '}
												{currency}
											</span>
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
			</div>

			{/* Activity table (small breakpoint and up) */}
			<div className="hidden sm:block">
				<div className="mx-auto max-w-7xl">
					<div className="mt-2 flex flex-col">
						<div className="min-w-full overflow-hidden overflow-x-auto align-middle">
							<table className="min-w-full divide-y divide-slate-200">
								<thead>
									<tr>
										<th
											className="py-3 text-left text-xs font-semibold text-slate-900"
											scope="col"
										>
											Hash
										</th>
										<th
											className="py-3 text-right text-xs font-semibold text-slate-900"
											scope="col"
										>
											Amount
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 bg-white">
									{transactions?.map(tx => (
										<tr key={tx.hash} className="bg-white">
											<td className="w-full max-w-0 whitespace-nowrap py-3 text-xs text-slate-900">
												<div className="flex">
													<Link
														target="_blank"
														href={explorerUrl(tx.hash)}
														className="group inline-flex items-center space-x-2 truncate text-xs"
													>
														<ArrowRightLeftIcon
															className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
															aria-hidden="true"
														/>
														<p className="truncate text-slate-500 group-hover:text-slate-900">
															{truncateAddress(tx.hash)}
														</p>
													</Link>
												</div>
											</td>
											<td className="whitespace-nowrap py-3 text-right text-xs text-slate-500">
												<span className="font-medium text-slate-900">
													{tx.amount}
												</span>{' '}
												{currency}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
