import ActivityDot from '@/components/ActivityDot'
import Link from 'next/link'
import { ArrowUpCircleIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { cookies } from 'next/headers'
import { Client } from '@/core/client'

const fetchData = async (serviceIdOrSlug: string) => {
	const client = new Client(await cookies())
	return await client.webhooks.list(serviceIdOrSlug)
}

export const metadata = {
	title: 'Webhooks',
}

export default async function Webhooks(props: {
	params: Promise<{
		serviceIdOrSlug: string
	}>
}) {
	const params = await props.params

	const { serviceIdOrSlug } = params

	const webhooks = await fetchData(serviceIdOrSlug)

	return (
		<div className="w-full">
			<header className="px-1 py-4">
				<div className="flex items-center">
					<h1 className="flex-1 text-lg font-medium">Webhooks</h1>
					<Link href={`/${serviceIdOrSlug}/webhooks/new`}>
						<Button color="nano" size="sm">
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Webhook
						</Button>
					</Link>
				</div>
			</header>
			{webhooks?.length ? (
				<ul role="list" className="space-y-2">
					{webhooks?.map(webhook => (
						<li
							key={webhook.id}
							className="relative rounded-md border border-slate-200 bg-white py-5 pl-4 pr-6 hover:bg-slate-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
						>
							<div className="flex items-center justify-between space-x-4">
								{/* Service name and description */}
								<div className="min-w-0 space-y-3">
									<div className="flex items-center space-x-3">
										{webhook.active ? (
											<ActivityDot status="active" />
										) : (
											<ActivityDot status="inactive" />
										)}
										<Link href={`/${serviceIdOrSlug}/webhooks/${webhook.id}`}>
											<h2 className="text-sm font-medium">
												<span className="absolute inset-0" aria-hidden="true" />
												{webhook.name}
											</h2>
										</Link>
									</div>
									<p className="group relative flex items-center space-x-2.5">
										<span className="text-xs font-medium text-slate-500">
											{webhook.url}
										</span>
									</p>
								</div>
								<div className="sm:hidden">
									<ChevronRightIcon
										className="h-5 w-5 text-slate-400"
										aria-hidden="true"
									/>
								</div>
								{/* Service meta info */}
								<div className="hidden shrink-0 flex-col items-end space-y-3 sm:flex">
									<p className="flex space-x-2 text-xs text-slate-500">
										<span aria-hidden="true">&middot;</span>
										<span>
											Created at{' '}
											{new Date(webhook.created_at).toLocaleDateString(
												undefined,
												{
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												},
											)}
										</span>
									</p>
									{webhook.event_types.map(eventType => (
										<p className="flex items-center space-x-1" key={eventType}>
											<ArrowUpCircleIcon className="h-4 w-4 text-slate-400" />
											<span className="text-xs font-semibold text-slate-500">
												{eventType}
											</span>
										</p>
									))}
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="flex h-40 items-center justify-center">
					<p className="text-slate-500">No webhooks found</p>
				</div>
			)}
		</div>
	)
}
