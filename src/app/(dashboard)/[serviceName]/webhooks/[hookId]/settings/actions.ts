'use server'

import { HookUpdate } from '@/types/hooks'
import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export const updateWebhook = async (
	hookId: string,
	{ name, description, url, event_types, secret }: HookUpdate,
) => {
	const supabase = createClient(cookies())

	const { data, error } = await supabase
		.from('hooks')
		.update({
			name,
			description,
			url,
			event_types,
			secret,
		})
		.eq('id', hookId)
		.select('service:services(name)')
		.single()

	if (error) {
		if (error.code === 'PGRST116') {
			throw new Error('nothing updated')
		}
		throw new Error(error.message)
	}

	revalidateTag(`service-${data.service?.name}-webhooks`)
	revalidateTag(`webhook-${hookId}`)
}
