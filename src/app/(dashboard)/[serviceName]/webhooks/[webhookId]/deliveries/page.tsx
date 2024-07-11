import { WebhookDelivieries } from '@/components/WebhookDeliveries'
import { cookies } from 'next/headers'
import { Client } from '@/services/client'

interface Props {
	params: {
		serviceName: string
		webhookdId: string
	}
}

export const metadata = {
	title: 'Webhook Deliveries',
}

export default async function WebhookDeliveries({
	params: { webhookdId },
}: Props) {
	const client = new Client(cookies())
	const deliveries = await client.webhooks.deliveries(webhookdId)

	return <WebhookDelivieries deliveries={deliveries} />
}
