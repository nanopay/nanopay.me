'use server'

import { Client } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { WebhookCreate } from '@/services/client/webhooks/webhooks-types'

export const createWebhook = async (
	serviceNameOrId: string,
	{ name, description, url, event_types, secret }: WebhookCreate,
) => {
	const client = new Client(cookies())
	const { id } = await client.webhooks.create(serviceNameOrId, {
		name,
		description,
		url,
		event_types,
		secret,
	})

	redirect(`/${serviceNameOrId}/webhooks/${id}/settings`)
}
