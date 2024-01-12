import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
	const supabase = createClient(cookies())

	const { data, error } = await supabase
		.from('services')
		.select('id, name, avatar_url, description')

	if (error) {
		return Response.json(
			{ message: error.message },
			{
				status: 500,
			},
		)
	}

	return Response.json(data)
}
