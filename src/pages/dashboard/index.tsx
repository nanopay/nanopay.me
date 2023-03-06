import Head from 'next/head'
import Image from 'next/image'
import { PlusIcon } from '@heroicons/react/24/solid'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'

const projects = [
	{
		logo: require('@/images/logos/nano-xno.svg'),
		name: 'Workcation',
		href: '#',
		description:
			'Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.',
	},
]

export default function Dashboard() {
	return (
		<>
			<Head>
				<title>Dashboard - NanoPay.me</title>
			</Head>
			<Header />
			<main>
				<Container>
					<div className="grid grid-cols-1 gap-4 lg:col-span-2 py-8">
						{/* Welcome panel */}
						<section aria-labelledby="profile-overview-title">
							<div className="overflow-hidden rounded-lg bg-white shadow">
								<h2 className="sr-only" id="profile-overview-title">
									Profile Overview
								</h2>
								<div className="bg-white p-6">
									<div className="sm:flex sm:items-center sm:justify-between">
										<div className="sm:flex sm:space-x-5">
											<div className="flex-shrink-0">
												<Image
													className="mx-auto h-20 w-20 rounded-full"
													src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
													alt=""
												/>
											</div>
											<div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
												<p className="text-sm font-medium text-gray-600">
													Welcome back,
												</p>
												<p className="text-xl font-bold text-gray-900 sm:text-2xl">
													Chelsea Hagon
												</p>
												<p className="text-sm font-medium text-gray-600">
													Human Resources Manager
												</p>
											</div>
										</div>
										<div className="mt-5 flex justify-center sm:mt-0">
											<a
												href="#"
												className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
											>
												View profile
											</a>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
									<div className="px-6 py-5 text-center text-sm font-medium">
										<span className="text-gray-900">0</span>{' '}
										<span className="text-gray-600">...</span>
									</div>

									<div className="px-6 py-5 text-center text-sm font-medium">
										<span className="text-gray-900">0</span>{' '}
										<span className="text-gray-600">...</span>
									</div>

									<div className="px-6 py-5 text-center text-sm font-medium">
										<span className="text-gray-900">0</span>{' '}
										<span className="text-gray-600">...</span>
									</div>
								</div>
							</div>
						</section>

						{/* Actions panel */}
						<section aria-labelledby="projects-title">
							<div className="flex justify-between items-center">
								<h2
									id="projects-title"
									className="text-xl px-2 py-4 font-semibold
                                "
								>
									Your Projects
								</h2>
								<Button color="nano">
									<div className="flex space-x-2 items-center">
										<PlusIcon className="h-5 w-5" />
										<span>New Project</span>
									</div>
								</Button>
							</div>
							<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
								{projects.map((project, index) => (
									<div
										key={index}
										className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
									>
										<div>
											<span className="inline-flex rounded-lg p-3 bg-sky-50 text-sky-700 ring-4 ring-white">
												{
													<Image
														src={project.logo}
														alt={project.name}
														width={40}
														height={40}
													/>
												}
											</span>
										</div>
										<div className="mt-8">
											<h3 className="text-lg font-medium">
												<a href="#" className="focus:outline-none">
													{/* Extend touch target to entire panel */}
													<span
														className="absolute inset-0"
														aria-hidden="true"
													></span>
													{project.name}
												</a>
											</h3>
											<p className="mt-2 text-sm text-gray-500">
												{project.description}
											</p>
										</div>
										<span
											className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
											aria-hidden="true"
										>
											<svg
												className="h-6 w-6"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"></path>
											</svg>
										</span>
									</div>
								))}
							</div>
						</section>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	)
}