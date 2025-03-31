import { WebhookDelivieries } from '@/components/WebhookDeliveries'
import { cookies } from 'next/headers'
import { Client } from '@/core/client'

interface Props {
	params: Promise<{
		serviceIdOrSlug: string
		webhookId: string
	}>
}

export const metadata = {
	title: 'Webhook Deliveries',
}

export default async function WebhookDeliveries(props: Props) {
    const params = await props.params;

    const {
        webhookId
    } = params;

    const client = new Client(await cookies())
    const deliveries = await client.webhooks.deliveries(webhookId)

    return <WebhookDelivieries deliveries={deliveries} />
}
