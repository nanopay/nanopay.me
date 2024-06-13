'use server'

import { HookCreate } from '@/types/hooks'
import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const createWebhook = async (
	serviceName: string,
	{ name, description, url, event_types, secret }: HookCreate,
) => {
	const supabase = createClient(cookies())

	const { data: service, error: serviceError } = await supabase
		.from('services')
		.select('id')
		.eq('name', serviceName)
		.single()

	if (serviceError) {
		throw new Error(serviceError.message)
	}

	const { error: hookError, data: hook } = await supabase
		.from('hooks')
		.insert([
			{
				name,
				description,
				url,
				event_types,
				secret,
				service_id: service.id,
			},
		])
		.select('id')
		.single()

	if (hookError) {
		throw new Error(hookError.message)
	}

	revalidateTag(`service-${serviceName}-webhooks`)

	redirect(`/${serviceName}/webhooks/${hook.id}/settings`)
}
