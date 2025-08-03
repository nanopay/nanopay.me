'use server'

import { Client, webhookCreateSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { safeAction } from '@/lib/safe-action'
import { z } from 'zod'

export const createWebhook = safeAction
	.schema(
		webhookCreateSchema.extend({
			serviceIdOrSlug: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const client = new Client(await cookies())
		const { id } = await client.webhooks.create(parsedInput.serviceIdOrSlug, {
			name: parsedInput.name,
			description: parsedInput.description,
			url: parsedInput.url,
			event_types: parsedInput.event_types,
			secret: parsedInput.secret,
		})

		redirect(`/${parsedInput.serviceIdOrSlug}/webhooks/${id}/settings`)
	})
