'use client'

import { PlusIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/Button'
import { useQuery } from 'react-query'
import api from '@/services/api'
import ServicesList from '@/components/ServicesList'
import Loading from '@/components/Loading'
import ProfileBoard from '@/components/ProfileBoard'
import Invoices from '@/components/Invoices'
import { useAuth } from '@/contexts/AuthProvider'

export default function Home() {
	const { user } = useAuth()

	const { data: services, isLoading } = useQuery(
		'services',
		async () => await api.services.list().then(res => res.data),
	)

	return (
		<div className="grid grid-cols-1 gap-4 lg:col-span-2">
			{/* Welcome panel */}
			<section aria-labelledby="profile-overview-title">
				<ProfileBoard user={user} />
			</section>

			{/* Actions panel */}
			<section aria-labelledby="services-title">
				<div className="flex justify-between items-center">
					<h2
						id="services-title"
						className="text-xl px-2 py-4 font-semibold
                                "
					>
						{services?.length} Services
					</h2>
					<Button color="nano" href="/services/new">
						<div className="flex space-x-2 items-center">
							<PlusIcon className="h-5 w-5" />
							<span>New Service</span>
						</div>
					</Button>
				</div>
				{isLoading ? (
					<div className="flex flex-col space-y-6 justify-center items-center py-16">
						<Loading />
						<div className="text-slate-600 animate-pulse text-sm">
							Loading your services...
						</div>
					</div>
				) : services?.length ? (
					<ServicesList services={services} />
				) : (
					<div className="flex justify-center items-center py-16 rounded-lg bg-slate-200 shadow0">
						<p className="text-gray-700 text-center">
							You don&apos;t have any services yet.
						</p>
					</div>
				)}
			</section>
			<section aria-labelledby="invoices" className="mt-8">
				<h2 className="mx-auto mb-2 max-w-7xl px-2 text-lg font-medium leading-6 text-slate-900">
					All Invoices
				</h2>
				<Invoices invoices={[]} />
			</section>
		</div>
	)
}