import { cookies } from 'next/headers'
import { Client } from '@/core/client'
import { NotFoundCard } from '@/components/NotFoundCard'
import { getUserEmail } from '@/lib/supabase/server'

import ServiceWebsiteCard from './settings-cards/ServiceWebsiteCard'
import ServiceContactEmailCard from './settings-cards/ServiceContactEmailCard'
import ServiceAvatarCard from './settings-cards/ServiceAvatar'
import ServiceNameCard from './settings-cards/ServiceNameCard'
import ServiceDeleteCard from './settings-cards/ServiceDeleteCard'

interface Params {
	params: { serviceIdOrSlug: string }
}

const fetchData = async (serviceIdOrSlug: string) => {
	const client = new Client(cookies())
	return await client.services.get(serviceIdOrSlug)
}

export async function generateMetadata({
	params: { serviceIdOrSlug },
}: Params) {
	const service = await fetchData(serviceIdOrSlug)
	return {
		title: service ? `Settings - ${service.name}` : 'Not Found',
	}
}

export default async function ServiceSettingsPage({
	params: { serviceIdOrSlug },
}: Params) {
	const service = await fetchData(serviceIdOrSlug)

	const email = await getUserEmail(cookies())

	if (!service) {
		return <NotFoundCard path={`/${serviceIdOrSlug}`} forEmail={email} />
	}

	return (
		<div className="w-full">
			<div className="flex flex-col space-y-8">
				<ServiceNameCard serviceId={service.id} value={service.name} />

				<ServiceAvatarCard
					serviceId={service.id}
					serviceName={service.name}
					value={service.avatar_url}
				/>

				<ServiceContactEmailCard
					serviceId={service.id}
					value={service.contact_email}
				/>

				<ServiceWebsiteCard serviceId={service.id} value={service.website} />

				<ServiceDeleteCard service={service} />
			</div>
		</div>
	)
}
