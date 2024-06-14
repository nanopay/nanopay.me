import { createClient } from '@supabase/supabase-js'
import { ApiKeyInsert } from './api-key-types'

// Here we create a Supabase client with service role.
// This client can make any request to the database.
// BE CAREFUL! Never expose this client to other parts of the application.
const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_SECRET_KEY!,
)

export const retrieveApiKeyFromChecksum = async (checksum: string) => {
	const { data, error } = await supabase
		.from('api_keys')
		.select('id, name, description, service_id, scopes, created_at')
		.eq('checksum', checksum)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const insertApiKey = async ({
	service_id,
	name,
	description,
	scopes,
	checksum,
}: ApiKeyInsert) => {
	const { error } = await supabase.from('api_keys').insert({
		service_id,
		name,
		description,
		checksum,
		scopes,
	})

	if (error) {
		throw new Error(error.message)
	}
}
