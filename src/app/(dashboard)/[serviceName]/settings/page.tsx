import { cookies } from 'next/headers'
import { Settings } from './settings'
import { Client } from '@/services/client'

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
		title: `Settings - ${service.name}`,
	}
}

export default async function ServiceSettingsPage({
	params: { serviceName },
}: Params) {
	const service = await fetchData(serviceName)

	return (
		<div className="w-full">
			<Settings service={service} />
		</div>
	)
}
