import Fireworks from '@/components/Fireworks'
import { cookies } from 'next/headers'
import Invoices from '@/components/Invoices'
import DashCard, { DashCardProps } from '@/components/DashCard'
import ServiceHeader from '@/components/ServiceHeader'
import { KeyRoundIcon, ReceiptIcon, WebhookIcon } from 'lucide-react'
import { Client } from '@/services/client'
import { getUserEmail } from '@/utils/supabase/server'
import { NotFoundCard } from '@/components/NotFoundCard'

interface Props {
	params: { serviceName: string }
	searchParams: { new?: 'true' }
}

const fetchData = async (serviceName: string) => {
	const client = new Client(cookies())
	const [service, invoices] = await Promise.all([
		client.services.get(serviceName),
		client.invoices.list(serviceName),
	])
	return { service, invoices }
}

export async function generateMetadata({ params: { serviceName } }: Props) {
	const { service } = await fetchData(serviceName)
	return {
		title: service ? service.name : 'Not Found',
	}
}

export default async function ServiceDashboardPage({
	params: { serviceName },
	searchParams,
}: Props) {
	const isNew = searchParams.new ? true : false

	const { service, invoices } = await fetchData(serviceName)

	const email = await getUserEmail(cookies())

	if (!service) {
		return <NotFoundCard path={`/${serviceName}`} forEmail={email} />
	}

	const cards: DashCardProps[] = [
		{
			name: 'Invoices',
			href: `/${service.name}/invoices`,
			icon: ReceiptIcon,
			amount: service.invoices_count,
			hrefLabel: 'View All',
		},
		{
			name: 'API Keys',
			href: `/${service.name}/keys`,
			icon: KeyRoundIcon,
			amount: service.api_keys_count,
			hrefLabel: 'Manage Keys',
		},
		{
			name: 'Webhooks',
			href: `/${service.name}/webhooks`,
			icon: WebhookIcon,
			amount: service.webhooks_count,
			hrefLabel: 'View All',
		},
	]

	return (
		<div className="w-full">
			<ServiceHeader service={service} />

			<section className="mt-8" aria-labelledby="service-overview">
				<div className="mx-auto max-w-7xl">
					<h2 className="mb-2 px-2 text-lg font-medium leading-6 text-slate-900">
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
				<h2 className="mx-auto mb-2 max-w-7xl px-2 text-lg font-medium leading-6 text-slate-900">
					Recent Invoices
				</h2>
				<Invoices invoices={invoices || []} serviceName={service.name} />
			</section>

			{isNew && <Fireworks count={3} />}
		</div>
	)
}
