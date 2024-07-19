import { cookies } from 'next/headers'
import { Settings } from './settings'
import { Client } from '@/core/client'
import { NotFoundCard } from '@/components/NotFoundCard'
import { getUserEmail } from '@/lib/supabase/server'

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
			<Settings service={service} />
		</div>
	)
}
