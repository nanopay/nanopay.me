import { HookDelivery } from '@/types/hooks'
import { formatDateTime } from '@/utils/others'
import clsx from 'clsx'
import ActivityDot from './ActivityDot'
import { ChevronRightIcon } from 'lucide-react'

interface HookDelivieriesProps {
	deliveries: HookDelivery[]
}

const statusStyles = {
	success: 'bg-green-100 text-green-800',
	error: 'bg-red-100 text-red-800',
}

export default function HookDelivieries({ deliveries }: HookDelivieriesProps) {
	return (
		<>
			{/* Activity list (smallest breakpoint only) */}
			<div className="shadow sm:hidden">
				<ul
					role="list"
					className="mt-2 divide-y divide-slate-200 overflow-hidden shadow sm:hidden"
				>
					{deliveries?.map(delivery => (
						<li key={delivery.id}>
							<a
								href={`/hook-deliveries/${delivery.id}`}
								className="block bg-white px-4 py-4 hover:bg-slate-100"
							>
								<span className="flex items-center space-x-4">
									<span className="flex flex-1 space-x-2 truncate">
										<ActivityDot
											status={delivery.success ? 'active' : 'error'}
										/>
										<span className="flex flex-col truncate text-sm font-semibold text-slate-600">
											<span>{delivery.type}</span>
											<span>
												<span className="truncate text-slate-600">
													{delivery.url}
												</span>
											</span>
											<time dateTime={delivery.completed_at}>
												{formatDateTime(delivery.completed_at)}
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

				<nav
					className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3"
					aria-label="Pagination"
				>
					<div className="flex flex-1 justify-between">
						<a
							href="#"
							className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
						>
							Previous
						</a>
						<a
							href="#"
							className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
						>
							Next
						</a>
					</div>
				</nav>
			</div>

			{/* Activity table (small breakpoint and up) */}
			<div className="hidden sm:block">
				<div className="mx-auto max-w-7xl">
					<div className="mt-2 flex flex-col">
						<div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
							<table className="min-w-full divide-y divide-slate-200">
								<thead>
									<tr>
										<th
											className="bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900"
											scope="col"
										>
											Type
										</th>
										<th
											className="bg-slate-100 px-6 py-3 text-right text-sm font-semibold text-slate-900"
											scope="col"
										>
											URL
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
									{deliveries?.map(delivery => (
										<tr key={delivery.id} className="bg-white">
											<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-slate-900">
												<div className="flex items-center space-x-2">
													<ActivityDot
														status={delivery.success ? 'active' : 'error'}
													/>
													<p className="font-bold text-slate-600">
														{delivery.type}
													</p>
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<span className="truncate text-slate-600">
													{delivery.url}
												</span>
											</td>
											<td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-500 md:block">
												<span
													className={clsx(
														statusStyles[
															delivery.success ? 'success' : 'error'
														],
														'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
													)}
												>
													{delivery.success ? 'success' : 'error'}
												</span>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
												<time dateTime={delivery.completed_at}>
													{formatDateTime(delivery.completed_at)}
												</time>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							{/* Pagination */}
							<nav
								className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
								aria-label="Pagination"
							>
								<div className="hidden sm:block">
									<p className="text-sm text-slate-700">
										Showing <span className="font-medium">1</span> to{' '}
										<span className="font-medium">10</span> of{' '}
										<span className="font-medium">20</span> results
									</p>
								</div>
								<div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
									<a
										href="#"
										className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
									>
										Previous
									</a>
									<a
										href="#"
										className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
									>
										Next
									</a>
								</div>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
