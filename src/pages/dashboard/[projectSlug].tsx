import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import {
	BanknotesIcon,
	ChevronRightIcon,
	GlobeAltIcon,
	KeyIcon,
	PlusIcon,
	ScaleIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import clsx from 'clsx'
import logoXno from '@/images/logos/nano-xno.svg'

const cards = [
	{ name: 'Account balance', href: '#', icon: ScaleIcon, amount: '$30,659.45' },
	// More items...
]
const transactions = [
	{
		id: 1,
		name: 'Payment from Molly Sanders',
		href: '#',
		amount: '$20,000',
		currency: 'XNO',
		status: 'success',
		date: 'July 11, 2020',
		datetime: '2020-07-11',
	},
	{
		id: 2,
		name: 'Payment from Doug Man',
		href: '#',
		amount: '$20,000',
		currency: 'XNO',
		status: 'processing',
		date: 'July 11, 2020',
		datetime: '2020-07-11',
	},
	{
		id: 3,
		name: 'Payment from Erica Frost',
		href: '#',
		amount: '$20,000',
		currency: 'XNO',
		status: 'failed',
		date: 'July 11, 2020',
		datetime: '2020-07-11',
	},
]

type Status = 'success' | 'processing' | 'failed'

const statusStyles = {
	success: 'bg-green-100 text-green-800',
	processing: 'bg-yellow-100 text-yellow-800',
	failed: 'bg-slate-100 text-slate-800',
}

export default function Home() {
	return (
		<>
			<Head>
				<title>Dashboard - NanoPay.me</title>
			</Head>
			<Header />
			<main>
				<Container className="py-8">
					<div className="bg-white shadow">
						<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
							<div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-slate-200">
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
													My Merchant Project
												</h1>
											</div>
											<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
												<dt className="sr-only">Website</dt>
												<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
													<GlobeAltIcon
														className="mr-1.5 h-5 w-5 flex-shrink-0 text-slate-400"
														aria-hidden="true"
													/>
													www.example.com
												</dd>
											</dl>
										</div>
									</div>
								</div>
								<div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
									<Button
										variant="outline"
										color="nano"
										className="items-center"
									>
										<KeyIcon
											className="-ml-1 mr-2 h-4 w-4"
											aria-hidden="true"
										/>
										API Key
									</Button>
									<Button color="nano" className="items-center">
										<PlusIcon
											className="-ml-1 mr-2 h-5 w-5"
											aria-hidden="true"
										/>
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
										<div className="bg-slate-50 px-5 py-3">
											<div className="text-sm">
												<a
													href={card.href}
													className="font-medium text-cyan-700 hover:text-cyan-900"
												>
													View all
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<h2 className="mx-auto mt-8 max-w-7xl px-4 text-lg font-medium leading-6 text-slate-900">
							Recent activity
						</h2>

						{/* Activity list (smallest breakpoint only) */}
						<div className="shadow sm:hidden">
							<ul
								role="list"
								className="mt-2 divide-y divide-slate-200 overflow-hidden shadow sm:hidden"
							>
								{transactions.map(transaction => (
									<li key={transaction.id}>
										<a
											href={transaction.href}
											className="block bg-white px-4 py-4 hover:bg-slate-50"
										>
											<span className="flex items-center space-x-4">
												<span className="flex flex-1 space-x-2 truncate">
													<BanknotesIcon
														className="h-5 w-5 flex-shrink-0 text-slate-400"
														aria-hidden="true"
													/>
													<span className="flex flex-col truncate text-sm text-slate-500">
														<span className="truncate">{transaction.name}</span>
														<span>
															<span className="font-medium text-slate-900">
																{transaction.amount}
															</span>{' '}
															{transaction.currency}
														</span>
														<time dateTime={transaction.datetime}>
															{transaction.date}
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
										className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
									>
										Previous
									</a>
									<a
										href="#"
										className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
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
														className="bg-slate-50 px-6 py-3 text-left text-sm font-semibold text-slate-900"
														scope="col"
													>
														Transaction
													</th>
													<th
														className="bg-slate-50 px-6 py-3 text-right text-sm font-semibold text-slate-900"
														scope="col"
													>
														Amount
													</th>
													<th
														className="hidden bg-slate-50 px-6 py-3 text-left text-sm font-semibold text-slate-900 md:block"
														scope="col"
													>
														Status
													</th>
													<th
														className="bg-slate-50 px-6 py-3 text-right text-sm font-semibold text-slate-900"
														scope="col"
													>
														Date
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-200 bg-white">
												{transactions.map(transaction => (
													<tr key={transaction.id} className="bg-white">
														<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-slate-900">
															<div className="flex">
																<a
																	href={transaction.href}
																	className="group inline-flex space-x-2 truncate text-sm"
																>
																	<BanknotesIcon
																		className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-500"
																		aria-hidden="true"
																	/>
																	<p className="truncate text-slate-500 group-hover:text-slate-900">
																		{transaction.name}
																	</p>
																</a>
															</div>
														</td>
														<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
															<span className="font-medium text-slate-900">
																{transaction.amount}
															</span>{' '}
															{transaction.currency}
														</td>
														<td className="hidden whitespace-nowrap px-6 py-4 text-sm text-slate-500 md:block">
															<span
																className={clsx(
																	statusStyles[transaction.status as Status],
																	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
																)}
															>
																{transaction.status}
															</span>
														</td>
														<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-500">
															<time dateTime={transaction.datetime}>
																{transaction.date}
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
				</Container>
			</main>
			<Footer />
		</>
	)
}
