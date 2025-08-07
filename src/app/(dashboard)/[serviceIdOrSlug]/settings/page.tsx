import { cookies } from 'next/headers'
import { NotFoundCard } from '@/components/NotFoundCard'
import { getUserEmail } from '@/lib/supabase/server'

import ServiceWebsiteCard from './_components/ServiceWebsiteCard'
import ServiceContactEmailCard from './_components/ServiceContactEmailCard'
import ServiceAvatarCard from './_components/ServiceAvatarCard'
import ServiceNameCard from './_components/ServiceNameCard'
import ServiceDeleteCard from './_components/ServiceDeleteCard'
import { getCachedServiceByIdOrSlug } from '@/lib/cache/services'
import { Metadata } from 'next'

interface Params {
	params: Promise<{ serviceIdOrSlug: string }>
}

const fetchData = async (serviceIdOrSlug: string) => {
	return await getCachedServiceByIdOrSlug(serviceIdOrSlug)
}

export const metadata: Metadata = {
	title: 'Settings',
}

export default async function ServiceSettingsPage(props: Params) {
	const params = await props.params

	const { serviceIdOrSlug } = params

	const service = await fetchData(serviceIdOrSlug)

	const email = await getUserEmail(await cookies())

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
