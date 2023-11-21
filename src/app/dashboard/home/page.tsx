import { PlusIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/Button'
import api from '@/services/api'
import ServicesList from '@/components/ServicesList'
import ProfileBoard from '@/components/ProfileBoard'
import Invoices from '@/components/Invoices'
import { cookies } from 'next/headers'
import { Service } from '@/types/services'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'

async function fetchData(): Promise<Service[]> {
	const supabase = createClient(cookies())

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		throw new Error('No user data')
	}

	return await api.services.list({
		headers: {
			Cookie: cookies().toString(),
		},
		next: {
			revalidate: false,
			tags: [`user-${session.user.id}-services`],
		},
	})
}

export const metadata: Metadata = {
	title: 'Home',
}

export default async function Home() {
	const services = await fetchData()

	return (
		<div className="grid grid-cols-1 gap-4 lg:col-span-2">
			{/* Welcome panel */}
			<section aria-labelledby="profile-overview-title">
				<ProfileBoard />
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
				{services.length > 0 ? (
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
