'use client'

import { formatDateTime } from '@/utils/others'
import clsx from 'clsx'
import ActivityDot from './ActivityDot'
import { ChevronRightIcon } from 'lucide-react'
import { WebhookDelivery } from '@/core/client/webhooks/webhooks-types'
import { NavPagination, NavPaginationMobile } from './NavPagination'
import { WebhookDeliveryDrawer } from './WebhookDeliveryDrawer'
import { useState } from 'react'

const statusStyles = {
	success: 'bg-green-100 text-green-800',
	error: 'bg-red-100 text-red-800',
}

export function WebhookDelivieries({
	deliveries,
}: {
	deliveries: WebhookDelivery[]
}) {
	const [activeWebhookDelivery, setActiveWebhookDelivery] =
		useState<WebhookDelivery | null>(null)

	return (
		<>
			{/* Activity list (smallest breakpoint only) */}
			<div className="shadow sm:hidden">
				<ul
					role="list"
					className="mt-2 divide-y divide-slate-200 overflow-hidden rounded-md shadow sm:hidden"
				>
					{deliveries?.map(delivery => (
						<li
							key={delivery.id}
							className="cursor-pointer bg-white px-4 py-4 hover:bg-slate-100"
							onClick={() => setActiveWebhookDelivery(delivery)}
						>
							<span className="flex items-center space-x-4">
								<span className="flex flex-1 space-x-2 truncate">
									<ActivityDot status={delivery.success ? 'active' : 'error'} />
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
						</li>
					))}
				</ul>

				<NavPaginationMobile
					count={deliveries.length}
					from={0}
					to={deliveries.length}
					limit={deliveries.length}
				/>
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
										<tr
											key={delivery.id}
											className="hover:bg-primary/20 cursor-pointer bg-white"
											onClick={() => setActiveWebhookDelivery(delivery)}
										>
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
							<NavPagination
								count={deliveries.length}
								from={0}
								to={deliveries.length}
								limit={deliveries.length}
							/>
						</div>
					</div>
				</div>
			</div>
			<WebhookDeliveryDrawer
				open={!!activeWebhookDelivery}
				onOpenChange={bool => !bool && setActiveWebhookDelivery(null)}
				delivery={activeWebhookDelivery}
			/>
		</>
	)
}
