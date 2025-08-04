import Fireworks from '@/components/Fireworks'
import { cookies } from 'next/headers'
import { InvoicesTable} from '@/components/InvoicesTable'
import DashCard, { DashCardProps } from '@/components/DashCard'
import ServiceHeader from '@/components/ServiceHeader'
import { KeyRoundIcon, ListIcon, ReceiptIcon, WebhookIcon } from 'lucide-react'
import { Client } from '@/core/client'
import { getUserEmail } from '@/lib/supabase/server'
import { NotFoundCard } from '@/components/NotFoundCard'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { DEFAULT_INVOICES_PAGINATION_LIMIT } from '@/core/constants'

interface Props {
	params: Promise<{ serviceIdOrSlug: string }>
	searchParams: Promise<{ new?: 'true' }>
}

const invoicesLimit = DEFAULT_INVOICES_PAGINATION_LIMIT

const fetchData = async (serviceIdOrSlug: string) => {
	const client = new Client(await cookies())
	const [service, invoices] = await Promise.all([
		client.services.get(serviceIdOrSlug),
		client.invoices.list(serviceIdOrSlug, {
			offset: 0,
			limit: invoicesLimit,
		}),
	])
	return { service, invoices }
}

export async function generateMetadata(props: Props) {
	const params = await props.params

	const { serviceIdOrSlug } = params

	const { service } = await fetchData(serviceIdOrSlug)
	return {
		title: service ? service.name : 'Not Found',
	}
}

export default async function ServiceDashboardPage(props: Props) {
	const searchParams = await props.searchParams
	const params = await props.params

	const { serviceIdOrSlug } = params

	const isNew = searchParams.new ? true : false

	const { service, invoices } = await fetchData(serviceIdOrSlug)

	const email = await getUserEmail(await cookies())

	if (!service) {
		return <NotFoundCard path={`/${serviceIdOrSlug}`} forEmail={email} />
	}

	const cards: DashCardProps[] = [
		{
			name: 'Invoices',
			href: `/${service.slug}/invoices`,
			icon: ReceiptIcon,
			amount: service.invoices_count,
			hrefLabel: 'View All',
		},
		{
			name: 'API Keys',
			href: `/${service.slug}/keys`,
			icon: KeyRoundIcon,
			amount: service.api_keys_count,
			hrefLabel: 'Manage Keys',
		},
		{
			name: 'Webhooks',
			href: `/${service.slug}/webhooks`,
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
					<h2 className="mb-2 text-lg font-medium leading-6 text-slate-900">
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
				<div className="mb-2 flex w-full max-w-7xl items-center justify-between">
					<h2 className="text-lg font-medium leading-6 text-slate-900">
						Recent Invoices
					</h2>
					<Link
						href={`/${service.slug}/invoices`}
						className="text-nano hover:underline"
					>
						<Button color="slate" size="sm" variant="outline">
							<ListIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							View All Invoices
						</Button>
					</Link>
				</div>
				<InvoicesTable
					invoices={invoices.invoices}
					count={invoices.count}
					serviceIdOrSlug={service.slug}
					offset={0}
					limit={invoicesLimit}
					showPagination={false}
				/>
			</section>

			{isNew && <Fireworks count={3} />}
		</div>
	)
}
