import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import {
	Cog6ToothIcon,
	GlobeAltIcon,
	KeyIcon,
	PlusIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import clsx from 'clsx'
import logoXno from '@/images/logos/nano-xno.svg'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { UserProfile } from '@/types/users'
import { Receipt, Webhook } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import api from '@/services/api'
import Loading from '@/components/Loading'
import Fireworks from '@/components/Fireworks'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import Invoices from '@/components/Invoices'

export default function ServiceDashboard({ user }: { user: UserProfile }) {
	const router = useRouter()

	const [isNew, setIsNew] = useState(false)

	const serviceName = router.query.serviceName as string

	const { data: service, isLoading } = useQuery({
		queryKey: ['service', serviceName],
		queryFn: () => api.services.get(serviceName).then(res => res.data),
	})

	const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
		queryKey: ['invoices', service?.id],
		queryFn: () =>
			api.invoices.list(service?.id as string).then(res => res.data),
		enabled: !!service,
	})

	useEffect(() => {
		// check if #new is in the url
		if (router.asPath.includes('#new')) {
			// set state new and remove #new from url
			setIsNew(true)
			router.replace(router.asPath.replace('#new', ''))
		}
	}, [])

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
			<Head>
				<title>{service.name} - NanoPay.me</title>
			</Head>
			<Layout user={user} showFooter>
				<div className="bg-white shadow rounded-lg">
					<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
						<div className="py-6 md:flex md:items-center md:justify-between">
							<div className="min-w-0 flex-1">
								{/* Profile */}
								<div className="flex items-center">
									<Image
										className="hidden h-16 w-16 rounded-full sm:block"
										src={logoXno}
										alt=""
									/>
									<div>
										<div className="flex items-center">
											<Image
												className="h-16 w-16 rounded-full sm:hidden"
												src={logoXno}
												alt=""
											/>
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
			</Layout>
		</>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createServerSupabaseClient(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	return {
		props: {
			user: session?.user?.user_metadata?.internal_profile || {
				name: 'error',
				email: 'error',
				avatar_url: 'error',
			},
		},
	}
}
