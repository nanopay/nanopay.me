'use server'

import { Client } from '@/core/client'
import { notificationsOptionsSchema } from '@/core/client/notifications'
import { safeAction } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

const getNotificationsSchema = z.object({
	serviceId: z.string(),
	options: notificationsOptionsSchema,
})

export const getNotifications = safeAction
	.schema(getNotificationsSchema)
	.action(async ({ parsedInput: { serviceId, options } }) => {
		const client = new Client(cookies())

		const { notifications, count } = await client.notifications.list(
			serviceId,
			options,
		)

		return {
			notifications,
			count,
		}
	})
