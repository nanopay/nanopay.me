'use server'

import { Client } from '@/services/client'
import { WebhookUpdate } from '@/services/client/webhooks/webhooks-types'
import { cookies } from 'next/headers'

export const updateWebhook = async (
	webhookId: string,
	{ name, description, url, event_types, secret }: WebhookUpdate,
) => {
	const client = new Client(cookies())

	await client.webhooks.update(webhookId, {
		name,
		description,
		url,
		event_types,
		secret,
	})
}
