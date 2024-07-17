import { cookies } from 'next/headers'
import { Settings } from './settings'
import { Client } from '@/core/client'
import { NotFoundCard } from '@/components/NotFoundCard'
import { getUserEmail } from '@/lib/supabase/server'

interface Params {
	params: { serviceName: string }
}

const fetchData = async (serviceName: string) => {
	const client = new Client(cookies())
	return await client.services.get(serviceName)
}

export async function generateMetadata({ params: { serviceName } }: Params) {
	const service = await fetchData(serviceName)
	return {
		title: service ? `Settings - ${service.name}` : 'Not Found',
	}
}

export default async function ServiceSettingsPage({
	params: { serviceName },
}: Params) {
	const service = await fetchData(serviceName)

	const email = await getUserEmail(cookies())

	if (!service) {
		return <NotFoundCard path={`/${serviceName}`} forEmail={email} />
	}

	return (
		<div className="w-full">
			<Settings service={service} />
		</div>
	)
}
