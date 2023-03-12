import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/solid'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { UserProfile } from '@/types/users'
import { useQuery } from 'react-query'
import api from '@/services/api'

export default function Dashboard({ user }: { user: UserProfile }) {
	const { data: projects, error } = useQuery(
		'projects',
		async () => await api.projects.getAll().then(res => res.data),
	)

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
													src={user.avatar_url}
													alt=""
													width={80}
													height={80}
												/>
											</div>
											<div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
												<p className="text-xs font-medium text-gray-600">
													Welcome back,
												</p>
												<p className="text-xl font-bold text-gray-900 sm:text-2xl">
													{user.name}
												</p>
												<p className="text-sm font-medium text-gray-600">
													{user.email}
												</p>
											</div>
										</div>
										<div className="mt-5 flex justify-center sm:mt-0">
											<a
												href="#"
												className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
											>
												View profile
											</a>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-slate-200 bg-slate-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
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
								<Button color="nano" href="/dashboard/projects/new">
									<div className="flex space-x-2 items-center">
										<PlusIcon className="h-5 w-5" />
										<span>New Project</span>
									</div>
								</Button>
							</div>
							<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-slate-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
								{projects?.map((project, index) => (
									<div
										key={index}
										className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
									>
										<div>
											<span className="inline-flex rounded-full p-3 bg-sky-50 text-sky-700 ring-4 ring-white">
												{
													<Image
														className="rounded-full"
														src={project.avatar_url}
														alt={project.name}
														width={40}
														height={40}
													/>
												}
											</span>
										</div>
										<div className="mt-8">
											<h3 className="text-lg font-medium">
												<Link
													href={`dashboard/projects/${project.name}`}
													className="focus:outline-none"
												>
													{/* Extend touch target to entire panel */}
													<span
														className="absolute inset-0"
														aria-hidden="true"
													></span>
													{project.name}
												</Link>
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
