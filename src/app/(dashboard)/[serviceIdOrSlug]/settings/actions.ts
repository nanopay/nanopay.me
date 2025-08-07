'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, serviceUpdateSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
	getCachedServiceByIdOrSlug,
	revalidateServiceCache,
} from '@/lib/cache/services'

export const deleteService = safeAction
	.schema(z.string())
	.action(async ({ parsedInput: serviceIdOrSlug }) => {
		const service = await getCachedServiceByIdOrSlug(serviceIdOrSlug)

		if (!service) {
			throw new Error('Service not found')
		}

		const client = new Client(await cookies())

		await client.services.delete(serviceIdOrSlug)

		revalidateServiceCache(service.id, service.slug)

		redirect('/')
	})

export const updateService = safeAction
	.schema(serviceUpdateSchema.extend({ serviceIdOrSlug: z.string() }))
	.action(async ({ parsedInput: { serviceIdOrSlug, ...data } }) => {
		const service = await getCachedServiceByIdOrSlug(serviceIdOrSlug)

		if (!service) {
			throw new Error('Service not found')
		}

		const client = new Client(await cookies())

		await client.services.update(serviceIdOrSlug, data)

		revalidateServiceCache(service.id, service.slug)
	})
