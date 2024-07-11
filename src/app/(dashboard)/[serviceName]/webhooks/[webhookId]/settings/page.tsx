import { cookies } from 'next/headers'
import { WebhookSettingsCard } from './webhook-settings-card'
import { Client } from '@/services/client'

interface Props {
	params: {
		serviceName: string
		webhookdId: string
	}
}

export const metadata = {
	title: 'Webhook Settings',
}

export default async function Webhooks({ params }: Props) {
	const client = new Client(cookies())
	const webhook = await client.webhooks.get(params.webhookdId)
	return <WebhookSettingsCard webhook={webhook} />
}
