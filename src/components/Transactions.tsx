import { explorerUrl, truncateAddress } from '@/utils/others'
import { ArrowsRightLeftIcon } from '@heroicons/react/20/solid'
import { BanknotesIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

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
					className="mt-2 divide-y divide-slate-200 overflow-hidden border-y border-slate-200 sm:hidden"
				>
					{transactions?.map(tx => (
						<li key={tx.hash}>
							<a
								target="_blank"
								href={explorerUrl(tx.hash)}
								className="block bg-white px-4 py-4 hover:bg-slate-100"
							>
								<span className="flex items-center space-x-4">
									<span className="flex flex-1 space-x-2 truncate">
										<BanknotesIcon
											className="h-5 w-5 flex-shrink-0 text-slate-400"
											aria-hidden="true"
										/>
										<span className="flex flex-col truncate text-sm text-slate-500">
											<span className="truncate">{tx.hash}</span>
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
						<div className="min-w-full overflow-hidden overflow-x-auto align-middle border-y border-slate-200">
							<table className="min-w-full divide-y divide-slate-200">
								<thead>
									<tr>
										<th
											className="px-6 py-3 text-left text-sm font-semibold text-slate-900"
											scope="col"
										>
											Hash
										</th>
										<th
											className="px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											Amount
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 bg-white">
									{transactions?.map(tx => (
										<tr key={tx.hash} className="bg-white">
											<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-slate-900">
												<div className="flex">
													<Link
														target="_blank"
														href={explorerUrl(tx.hash)}
														className="group inline-flex space-x-2 truncate text-sm items-center"
													>
														<ArrowsRightLeftIcon
															className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
															aria-hidden="true"
														/>
														<p className="truncate text-slate-500 group-hover:text-slate-900">
															{truncateAddress(tx.hash)}
														</p>
													</Link>
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
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
