import Head from 'next/head'
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
import ProjectsList from '@/components/ProjectsList'
import Loading from '@/components/Loading'
import ProfileDashboard from '@/components/ProfileDashboard'

export default function Dashboard({ user }: { user: UserProfile }) {
	const { data: projects, isLoading } = useQuery(
		'projects',
		async () => await api.projects.getAll().then(res => res.data),
	)

	return (
		<>
			<Head>
				<title>Dashboard - NanoPay.me</title>
			</Head>
			<Header
				className="bg-white border-b border-slate-100"
				user={user}
				size="md"
			/>
			<main>
				<Container>
					<div className="grid grid-cols-1 gap-4 lg:col-span-2 py-8">
						{/* Welcome panel */}
						<section aria-labelledby="profile-overview-title">
							<ProfileDashboard user={user} />
						</section>

						{/* Actions panel */}
						<section aria-labelledby="projects-title">
							<div className="flex justify-between items-center">
								<h2
									id="projects-title"
									className="text-xl px-2 py-4 font-semibold
                                "
								>
									{projects?.length} Projects
								</h2>
								<Button color="nano" href="/dashboard/projects/new">
									<div className="flex space-x-2 items-center">
										<PlusIcon className="h-5 w-5" />
										<span>New Project</span>
									</div>
								</Button>
							</div>
							{isLoading ? (
								<div className="flex flex-col space-y-6 justify-center items-center py-16">
									<Loading />
									<div className="text-slate-600 animate-pulse">
										Loading your projects...
									</div>
								</div>
							) : projects?.length ? (
								<ProjectsList projects={projects} />
							) : (
								<div className="flex justify-center items-center py-16 rounded-lg bg-slate-200 shadow0">
									<p className="text-gray-700 text-center">
										You don&apos;t have any projects yet.
									</p>
								</div>
							)}
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
