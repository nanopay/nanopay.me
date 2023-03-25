import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import {
	BanknotesIcon,
	ChevronRightIcon,
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
import { InvoiceStatus } from '@/types/invoice'
import { formatDateTime } from '@/utils/others'
import Layout from '@/components/Layout'

const statusStyles: Record<InvoiceStatus, string> = {
	paid: 'bg-green-100 text-green-800',
	pending: 'bg-yellow-100 text-yellow-800',
	processing: 'bg-yellow-100 text-yellow-800',
	paid_partial: 'bg-yellow-100 text-yellow-800',
	expired: 'bg-slate-100 text-slate-800',
	canceled: 'bg-slate-100 text-slate-800',
	refunded: 'bg-slate-100 text-slate-800',
	refunded_partial: 'bg-slate-100 text-slate-800',
	error: 'bg-red-100 text-red-800',
}

export default function ProjectDashboard({ user }: { user: UserProfile }) {
	const router = useRouter()

	const [isNew, setIsNew] = useState(false)

	const projectName = router.query.projectName as string

	const { data: project, isLoading } = useQuery({
		queryKey: ['apiKeys', projectName],
		queryFn: () => api.projects.get(projectName).then(res => res.data),
	})

	const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
		queryKey: ['invoices', project?.id],
		queryFn: () =>
			api.invoices.list(project?.id as string).then(res => res.data),
		enabled: !!project,
	})

	useEffect(() => {
		// check if #new is in the url
		if (router.asPath.includes('#new')) {
			// set state new and remove #new from url
			setIsNew(true)
			router.replace(router.asPath.replace('#new', ''))
		}
	}, [])

	if (!projectName) {
		return null
	}

	if (isLoading || !project) {
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
			href: '#',
			icon: Receipt,
			amount: 984,
			action: 'View All',
		},
		{
			name: 'API Keys',
			href: `/projects/${projectName}/keys`,
			icon: KeyIcon,
			amount: project.api_keys_count,
			action: 'Manage Keys',
		},
		{
			name: 'Webhooks',
			href: '#',
			icon: Webhook,
			amount: '435',
			action: 'View All',
		},
	]

	return (
		<>
			<Head>
				<title>{project.name} - NanoPay.me</title>
			</Head>
			<Layout user={user}>
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
												{project.name}
											</h1>
										</div>
										<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
											<dt className="sr-only">Website</dt>
											{project.website && (
												<dd className="sm:mr-6">
													<a
														href={project.website}
														className="truncate flex items-center text-sm font-medium text-slate-500 hover:text-nano"
													>
														<GlobeAltIcon
															className="mr-1 h-5 w-5 flex-shrink-0"
															aria-hidden="true"
														/>
														{project.website}
													</a>
												</dd>
											)}
											{project.description && (
												<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
													{project.description.slice(0, 60)}
													{project.description.length > 60 && '...'}
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
								<Button color="nano" className="items-center">
									<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
									Create Invoice
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8">
					<div className="mx-auto max-w-7xl px-4">
						<h2 className="text-lg font-medium leading-6 text-slate-900">
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

					<h2 className="mx-auto mt-8 max-w-7xl px-4 text-lg font-medium leading-6 text-slate-900">
						Recent Invoices
					</h2>

					{/* Activity list (smallest breakpoint only) */}
					<div className="shadow sm:hidden">
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
												<BanknotesIcon
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
						<div className="mx-auto max-w-7xl px-4">
							<div className="mt-2 flex flex-col">
								<div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
									<table className="min-w-full divide-y divide-slate-200">
										<thead>
											<tr>
												<th
													className="bg-slate-100 px-6 py-3 text-left text-sm font-semibold text-slate-900"
													scope="col"
												>
													Transaction
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
															<a
																href={`/invoices/${invoice.id}`}
																className="group inline-flex space-x-2 truncate text-sm"
															>
																<BanknotesIcon
																	className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
																	aria-hidden="true"
																/>
																<p className="truncate text-slate-500 group-hover:text-slate-900">
																	{invoice.title}
																</p>
															</a>
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
				</div>
				<Footer />
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