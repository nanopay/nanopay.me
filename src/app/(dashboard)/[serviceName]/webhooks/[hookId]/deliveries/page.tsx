import api from '@/services/api'
import HookDelivieries from '@/components/HookDeliveries'
import { cookies } from 'next/headers'

const fetchData = async (hookId: string) => {
	return api.services.hooks.deliveries.list(hookId, {
		headers: {
			Cookie: cookies().toString(),
		},
	})
}

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
	const deliveries = await fetchData(hookId)

	return <HookDelivieries deliveries={deliveries} />
}
