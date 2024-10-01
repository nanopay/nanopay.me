import { cookies } from 'next/headers'
import { Client } from '@/core/client'
import { NotFoundCard } from '@/components/NotFoundCard'
import { getUserEmail } from '@/lib/supabase/server'

import ServiceWebsiteCard from './_components/ServiceWebsiteCard'
import ServiceContactEmailCard from './_components/ServiceContactEmailCard'
import ServiceAvatarCard from './_components/ServiceAvatarCard'
import ServiceNameCard from './_components/ServiceNameCard'
import ServiceDeleteCard from './_components/ServiceDeleteCard'

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
