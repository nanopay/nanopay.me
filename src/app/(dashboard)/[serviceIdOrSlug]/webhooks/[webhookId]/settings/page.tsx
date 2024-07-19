import { cookies } from 'next/headers'
import { WebhookSettingsCard } from './webhook-settings-card'
import { Client } from '@/core/client'

interface Props {
	params: {
		serviceIdOrSlug: string
		webhookId: string
	}
}

export const metadata = {
	title: 'Webhook Settings',
}

export default async function Webhooks({ params }: Props) {
	const client = new Client(cookies())
	const webhook = await client.webhooks.get(params.webhookId)
	return <WebhookSettingsCard webhook={webhook} />
}
