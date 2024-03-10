'use server'

import { createClient, getUserId } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const deleteService = async (serviceName: string) => {
	const userId = await getUserId(cookies())
	const supabase = createClient(cookies())

	const { error } = await supabase
		.from('services')
		.delete()
		.eq('name', serviceName)

	if (error) {
		throw new Error(error.message)
	}

	revalidateTag(`service-${serviceName}`)
	revalidateTag(`user-${userId}-services`)

	redirect('/home')
}
