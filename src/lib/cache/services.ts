import { Client, Service } from '@/core/client'
import { getUserId } from '@/utils/supabase/server'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

export async function getCachedUserServices(): Promise<Service[]> {
	const userId = await getUserId(cookies())
	const client = new Client(cookies())
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
