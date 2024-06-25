import HookDelivieries from '@/components/HookDeliveries'
import { cookies } from 'next/headers'
import { Client } from '@/services/client'

interface Props {
	params: {
		serviceName: string
		hookId: string
	}
}

export const metadata = {
	title: 'Webhook Deliveries',
}

export default async function WebhookDeliveries({ params: { hookId } }: Props) {
	const client = new Client(cookies())
	const deliveries = await client.webhooks.deliveries(hookId)

	return <HookDelivieries deliveries={deliveries} />
}
