'use client'

import { Service } from '@/core/client'
import ServiceWebsiteCard from './settings-cards/ServiceWebsiteCard'
import ServiceContactEmailCard from './settings-cards/ServiceContactEmailCard'
import ServiceAvatarCard from './settings-cards/ServiceAvatar'
import ServiceNameCard from './settings-cards/ServiceNameCard'
import ServiceDeleteCard from './settings-cards/ServiceDeleteCard'

export function ServiceSettings({ service }: { service: Service }) {
	return (
		<>
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
		</>
	)
}
