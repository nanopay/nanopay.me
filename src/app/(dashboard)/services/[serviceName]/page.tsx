import api from '@/services/api'
import Fireworks from '@/components/Fireworks'
import { cookies } from 'next/headers'
import { KeyIcon } from '@heroicons/react/24/solid'
import { Receipt, Webhook } from '@mui/icons-material'
import Invoices from '@/components/Invoices'
import DashCard, { DashCardProps } from '@/components/DashCard'
import ServiceHeader from '@/components/ServiceHeader'

interface Params {
	params: { serviceName: string }
	searchParams: { isNew?: 'true' }
}

const fetchData = async (serviceName: string) => {
	const [service, invoices] = await Promise.all([
		api.services.get(serviceName, {
			headers: {
				Cookie: cookies().toString(),
			},
			next: {
				revalidate: false,
				tags: [`service-${serviceName}`],
			},
		}),
		api.invoices.list(serviceName, {
			headers: {
				Cookie: cookies().toString(),
			},
			next: {
				revalidate: false,
				tags: [`service-${serviceName}-invoices`],
			},
		}),
	])

	return { service, invoices }
}

export async function generateMetadata({ params: { serviceName } }: Params) {
	const { service } = await fetchData(serviceName)
	return {
		title: service.name,
	}
}

export default async function ServiceDashboardPage({
	params: { serviceName },
	searchParams,
}: Params) {
	const isNew = searchParams.isNew ? true : false

	const { service, invoices } = await fetchData(serviceName)

	const cards: DashCardProps[] = [
		{
			name: 'Invoices',
			href: `/services/${service.name}/invoices`,
			icon: Receipt,
			amount: service.invoices_count,
			hrefLabel: 'View All',
		},
		{
			name: 'API Keys',
			href: `/services/${service.name}/keys`,
			icon: KeyIcon,
			amount: service.api_keys_count,
			hrefLabel: 'Manage Keys',
		},
		{
			name: 'Webhooks',
			href: `/services/${service.name}/hooks`,
			icon: Webhook,
			amount: service.hooks_count,
			hrefLabel: 'View All',
		},
	]

	return (
		<>
			<ServiceHeader service={service} />

			<section className="mt-8" aria-labelledby="service-overview">
				<div className="mx-auto max-w-7xl">
					<h2 className="text-lg font-medium leading-6 text-slate-900 px-2 mb-2">
						Overview
					</h2>
					<div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{cards.map(card => (
							<DashCard {...card} key={card.name} />
						))}
					</div>
				</div>
			</section>

			<section className="mt-8" aria-labelledby="service-invoices">
				<h2 className="mx-auto max-w-7xl px-2 mb-2 text-lg font-medium leading-6 text-slate-900">
					Recent Invoices
				</h2>
				<Invoices invoices={invoices || []} serviceName={service.name} />
			</section>

			{isNew && <Fireworks count={3} />}
		</>
	)
}
