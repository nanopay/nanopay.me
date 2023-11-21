'use client'

import Head from 'next/head'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import {
	Cog6ToothIcon,
	GlobeAltIcon,
	KeyIcon,
	PlusIcon,
} from '@heroicons/react/24/solid'
import { Receipt, Webhook } from '@mui/icons-material'
import { useQuery } from 'react-query'
import api from '@/services/api'
import Loading from '@/components/Loading'
import Fireworks from '@/components/Fireworks'
import Invoices from '@/components/Invoices'
import { useUser } from '@/contexts/UserProvider'
import DefaultAvatar from '@/components/DefaultAvatar'

export default function ServiceDashboard({
	params: { serviceName },
	searchParams,
}: {
	params: { serviceName: string }
	searchParams: { isNew?: 'true' }
}) {
	const user = useUser()

	const isNew = searchParams.isNew ? true : false

	const { data: service, isLoading } = useQuery({
		queryKey: ['service', serviceName],
		queryFn: () => api.services.get(serviceName),
	})

	const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
		queryKey: ['invoices', service?.id],
		queryFn: () => api.invoices.list(service?.id as string),
		enabled: !!service,
	})

	if (!serviceName) {
		return null
	}

	if (isLoading || !service) {
		return (
			<>
				<Head>
					<title>Dashboard - NanoPay.me</title>
				</Head>
				<Header className="bg-white border-b border-slate-100" user={user} />
				<div className="py-8 flex items-center justify-center h-full -mt-16">
					<Loading />
				</div>
			</>
		)
	}

	const cards = [
		{
			name: 'Invoices',
			href: `/services/${serviceName}/invoices`,
			icon: Receipt,
			amount: service.invoices_count,
			action: 'View All',
		},
		{
			name: 'API Keys',
			href: `/services/${serviceName}/keys`,
			icon: KeyIcon,
			amount: service.api_keys_count,
			action: 'Manage Keys',
		},
		{
			name: 'Webhooks',
			href: `/services/${serviceName}/hooks`,
			icon: Webhook,
			amount: service.hooks_count,
			action: 'View All',
		},
	]

	return (
		<>
			{/* <Head>
				<title>{service.name} - NanoPay.me</title>
			</Head> */}
			<>
				<div className="bg-white shadow rounded-lg">
					<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
						<div className="py-6 md:flex md:items-center md:justify-between">
							<div className="min-w-0 flex-1">
								{/* Profile */}
								<div className="flex items-center">
									<div className="hidden sm:flex">
										<DefaultAvatar
											name={service.name}
											size={64}
											src={service.avatar_url}
										/>
									</div>
									<div>
										<div className="flex items-center">
											<div className="sm:hidden">
												<DefaultAvatar
													name={service.name}
													size={64}
													src={service.avatar_url}
												/>
											</div>
											<h1 className="ml-3 text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:leading-9">
												{service.name}
											</h1>
										</div>
										<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
											<dt className="sr-only">Website</dt>
											{service.website && (
												<dd className="sm:mr-6">
													<a
														href={service.website}
														className="truncate flex items-center text-sm font-medium text-slate-500 hover:text-nano"
													>
														<GlobeAltIcon
															className="mr-1 h-5 w-5 flex-shrink-0"
															aria-hidden="true"
														/>
														{service.website}
													</a>
												</dd>
											)}
											{service.description && (
												<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
													{service.description.slice(0, 60)}
													{service.description.length > 60 && '...'}
												</dd>
											)}
										</dl>
									</div>
								</div>
							</div>
							<div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
								<Button variant="outline" color="nano" className="items-center">
									<Cog6ToothIcon
										className="-ml-1 mr-2 h-4 w-4"
										aria-hidden="true"
									/>
									Settings
								</Button>
								<Button
									color="nano"
									className="items-center"
									href={`/services/${serviceName}/invoices/new`}
								>
									<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
									Create Invoice
								</Button>
							</div>
						</div>
					</div>
				</div>

				<section className="mt-8" aria-labelledby="service-overview">
					<div className="mx-auto max-w-7xl">
						<h2 className="text-lg font-medium leading-6 text-slate-900 px-2 mb-2">
							Overview
						</h2>
						<div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{/* Card */}
							{cards.map(card => (
								<div
									key={card.name}
									className="overflow-hidden rounded-lg bg-white shadow"
								>
									<div className="p-5">
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<card.icon
													className="h-6 w-6 text-slate-400"
													aria-hidden="true"
												/>
											</div>
											<div className="ml-5 w-0 flex-1">
												<dl>
													<dt className="truncate text-sm font-medium text-slate-500">
														{card.name}
													</dt>
													<dd>
														<div className="text-lg font-medium text-slate-900">
															{card.amount}
														</div>
													</dd>
												</dl>
											</div>
										</div>
									</div>
									<div className="bg-slate-100 px-5 py-3">
										<div className="text-sm">
											<a
												href={card.href}
												className="font-medium text-cyan-700 hover:text-cyan-900"
											>
												{card.action}
											</a>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="mt-8" aria-labelledby="service-invoices">
					<h2 className="mx-auto max-w-7xl px-2 mb-2 text-lg font-medium leading-6 text-slate-900">
						Recent Invoices
					</h2>
					<Invoices invoices={invoices || []} serviceName={serviceName} />
				</section>

				{isNew && <Fireworks count={3} />}
			</>
		</>
	)
}
