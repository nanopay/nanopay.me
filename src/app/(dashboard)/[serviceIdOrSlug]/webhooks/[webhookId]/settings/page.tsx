import { cookies } from 'next/headers'
import { WebhookSettingsCard } from './webhook-settings-card'
import { Client } from '@/core/client'

interface Props {
	params: Promise<{
		serviceIdOrSlug: string
		webhookId: string
	}>
}

export const metadata = {
	title: 'Webhook Settings',
}

export default async function Webhooks(props: Props) {
	const params = await props.params
	const client = new Client(await cookies())
	const webhook = await client.webhooks.get(params.webhookId)
	return <WebhookSettingsCard webhook={webhook} />
}
