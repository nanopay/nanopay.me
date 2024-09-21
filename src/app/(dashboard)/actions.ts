'use server'

import { Client } from '@/core/client'
import { notificationsOptionsSchema } from '@/core/client/notifications'
import { safeAction } from '@/lib/safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const getNotifications = safeAction
	.schema(
		z.object({
			serviceId: z.string(),
			options: notificationsOptionsSchema,
		}),
	)
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

export const archiveNotification = safeAction
	.schema(z.object({ notificationId: z.string().uuid() }))
	.action(async ({ parsedInput: { notificationId } }) => {
		const client = new Client(cookies())
		await client.notifications.archive(notificationId)
	})

export const archiveAllNotifications = safeAction
	.schema(z.object({ serviceId: z.string().uuid() }))
	.action(async ({ parsedInput: { serviceId } }) => {
		const client = new Client(cookies())
		await client.notifications.archiveAll(serviceId)
	})
