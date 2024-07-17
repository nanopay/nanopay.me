import { WebhookDelivieries } from '@/components/WebhookDeliveries'
import { cookies } from 'next/headers'
import { Client } from '@/core/client'

interface Props {
	params: {
		serviceName: string
		webhookId: string
	}
}

export const metadata = {
	title: 'Webhook Deliveries',
}

export default async function WebhookDeliveries({
	params: { webhookId },
}: Props) {
	const client = new Client(cookies())
	const deliveries = await client.webhooks.deliveries(webhookId)

	return <WebhookDelivieries deliveries={deliveries} />
}
