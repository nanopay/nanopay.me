import { Button } from '@/components/Button'
import { AlertTriangle, ChevronRightIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Client } from '@/core/client'
import DeleteApiKeyButton from './delete'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'API Keys',
}

export default async function ApiKeys(props: {
	params: Promise<{ serviceIdOrSlug: string }>
}) {
	const params = await props.params

	const { serviceIdOrSlug } = params

	const client = new Client(await cookies())
	const apiKeys = await client.apiKeys.list(serviceIdOrSlug)

	return (
		<div className="w-full">
			<div className="border-b border-slate-200 pb-4 pl-4 pr-6 pt-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
				<div className="flex items-center">
					<h1 className="flex-1 text-lg font-medium">API Keys</h1>
					<Link href={`/${serviceIdOrSlug}/keys/new`}>
						<Button color="nano">
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Key
						</Button>
					</Link>
				</div>
			</div>
			<ul
				role="list"
				className="divide-y divide-slate-200 border-b border-slate-200"
			>
				{apiKeys &&
					apiKeys?.map(apiKey => (
						<li
							key={apiKey.checksum}
							className="relative py-5 pl-4 pr-6 hover:bg-slate-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
						>
							<div className="flex items-center justify-between space-x-4">
								{/* Service name and description */}
								<div className="min-w-0 space-y-3">
									<div className="flex items-center space-x-3">
										<h2 className="text-sm font-medium">
											<span aria-hidden="true" />
											{apiKey.name}
										</h2>
									</div>
									<p className="group relative flex items-center space-x-2.5">
										<span className="text-xs font-medium text-slate-500 group-hover:text-slate-900">
											{apiKey.description}
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
								<div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
									<p className="flex space-x-2 text-xs text-slate-500">
										<span aria-hidden="true">&middot;</span>
										<span>
											Created at{' '}
											{new Date(apiKey.created_at).toLocaleDateString(
												undefined,
												{
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												},
											)}
										</span>
									</p>
									<p className="group relative flex items-center space-x-1">
										<AlertTriangle className="h-4 w-4 text-yellow-400" />
										<span className="text-xs font-medium text-slate-500 group-hover:text-slate-900">
											This token has no expiration date.
										</span>
									</p>
								</div>
							</div>
							<DeleteApiKeyButton checksum={apiKey.checksum} />
						</li>
					))}
			</ul>
		</div>
	)
}
