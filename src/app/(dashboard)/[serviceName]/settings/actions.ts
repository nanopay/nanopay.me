'use server'

import { Client } from '@/services/client'
import { getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const deleteService = async (serviceName: string) => {
	const userId = await getUserId(cookies())

	const client = new Client(cookies())

	await client.services.delete(serviceName)

	revalidateTag(`service-${serviceName}`)
	revalidateTag(`user-${userId}-services`)

	redirect('/')
}
