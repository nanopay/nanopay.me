import { Client, Service } from '@/core/client'
import { getUserId } from '@/lib/supabase/server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

export async function getCachedUserServices(): Promise<Service[]> {
	const userId = await getUserId(await cookies())
	const client = new Client(await cookies())
	return unstable_cache(
		async () => {
			return await client.services.list()
		},
		[`user-${userId}-services`],
		{
			revalidate: false,
			tags: [`user-${userId}-services`],
		},
	)()
}

export async function getCachedServiceByIdOrSlug(
	serviceIdOrSlug: string,
): Promise<Service | null> {
	const client = new Client(await cookies())
	return unstable_cache(
		async () => {
			return await client.services.get(serviceIdOrSlug)
		},
		[`service-${serviceIdOrSlug}`],
		{
			revalidate: false,
			tags: [`service-${serviceIdOrSlug}`],
		},
	)()
}

export async function revalidateServiceCache(
	serviceId: string,
	serviceSlug: string,
): Promise<void> {
	const userId = await getUserId(await cookies())
	revalidateTag(`service-${serviceId}`)
	revalidateTag(`service-${serviceSlug}`)
	revalidateTag(`user-${userId}-services`)
}
