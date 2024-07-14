'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, webhookUpdateSchema } from '@/services/client'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const updateWebhook = safeAction
	.schema(
		webhookUpdateSchema.extend({
			webhookId: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())

		await client.webhooks.update(parsedInput.webhookId, {
			name: parsedInput.name,
			description: parsedInput.description,
			url: parsedInput.url,
			event_types: parsedInput.event_types,
			secret: parsedInput.secret,
		})
	})
