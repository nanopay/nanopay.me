'use server'

import { createApiKey } from '@/services/api-key'
import { ApiKeyCreate } from '@/types/services'
import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export const createNewApiKey = async (data: ApiKeyCreate) => {
	const supabase = createClient(cookies())

	const { data: service, error } = await supabase
		.from('services')
		.select('id')
		.eq('name', data.service)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	const { apiKey, checksum } = await createApiKey({
		service_id: service.id,
		name: data.name,
		description: data.description,
	})

	revalidateTag(`service-${data.service}-api-keys`)

	return { apiKey }
}
