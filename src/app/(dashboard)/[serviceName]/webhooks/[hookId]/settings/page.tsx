import api from '@/services/api'
import { cookies } from 'next/headers'
import { WebhookSettingsCard } from './webhook-settings-card'

interface Props {
	params: {
		serviceName: string
		hookId: string
	}
}

const fetchData = async (hookId: string) => {
	return api.services.hooks.get(hookId, {
		headers: {
			Cookie: cookies().toString(),
		},
	})
}

export const metadata = {
	title: 'Webhook Settings',
}

export default async function Webhooks({ params }: Props) {
	const hook = await fetchData(params.hookId)
	return <WebhookSettingsCard hook={hook} />
}
