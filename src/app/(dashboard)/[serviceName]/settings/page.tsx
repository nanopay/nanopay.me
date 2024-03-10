import api from '@/services/api'
import { cookies } from 'next/headers'
import { Settings } from './settings'

interface Params {
	params: { serviceName: string }
}

const fetchData = async (serviceName: string) => {
	const service = await api.services.get(serviceName, {
		headers: {
			Cookie: cookies().toString(),
		},
		next: {
			revalidate: false,
			tags: [`service-${serviceName}`],
		},
	})

	return service
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
