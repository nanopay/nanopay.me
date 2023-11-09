'use client'

import Head from 'next/head'
import { useQuery } from 'react-query'
import {
	ChevronRightIcon,
	ExclamationTriangleIcon,
	PlusIcon,
} from '@heroicons/react/24/solid'
import { Button } from '@/components/Button'
import api from '@/services/api'

export default function ApiKeys({
	params: { serviceName },
}: {
	params: { serviceName: string }
}) {
	const {
		data: apiKeys,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['apiKeys', serviceName],
		queryFn: () => api.services.apiKeys.list(serviceName).then(res => res.data),
	})

	if (!serviceName) {
		return null
	}

	if (isLoading) {
		return 'Loading...'
	}

	if (error) {
		const message = api.getErrorMessage(error)
		if (message) {
			throw new Error(message)
		} else {
			throw error
		}
	}

	return (
		<>
			<Head>
				<title>Api Keys - NanoPay.me</title>
			</Head>
			<>
				<div className="border-b border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
					<div className="flex items-center">
						<h1 className="flex-1 text-lg font-medium">API Keys</h1>
						<Button
							color="nano"
							href={`/services/${serviceName}/keys/new`}
							className="items-center text-xs py-1"
						>
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Key
						</Button>
					</div>
				</div>
				<ul
					role="list"
					className="divide-y divide-gray-200 border-b border-gray-200"
				>
					{apiKeys &&
						apiKeys?.map(apiKey => (
							<li
								key={apiKey.id}
								className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
							>
								<div className="flex items-center justify-between space-x-4">
									{/* Service name and description */}
									<div className="min-w-0 space-y-3">
										<div className="flex items-center space-x-3">
											<h2 className="text-sm font-medium">
												<span className="absolute inset-0" aria-hidden="true" />
												{apiKey.name}
											</h2>
										</div>
										<p className="group relative flex items-center space-x-2.5">
											<span className="text-xs font-medium text-gray-500 group-hover:text-gray-900">
												{apiKey.description}
											</span>
										</p>
									</div>
									<div className="sm:hidden">
										<ChevronRightIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
									</div>
									{/* Service meta info */}
									<div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
										<p className="flex space-x-2 text-xs text-gray-500">
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
											<ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
											<span className="text-xs font-medium text-gray-500 group-hover:text-gray-900">
												This token has no expiration date.
											</span>
										</p>
									</div>
								</div>
							</li>
						))}
				</ul>
			</>
		</>
	)
}
