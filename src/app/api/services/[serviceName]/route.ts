import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(
	req: NextRequest,
	{
		params: { serviceName },
	}: {
		params: {
			serviceName: string
		}
	},
) {
	const supabase = createClient(cookies())

	const { data, error } = await supabase
		.from('services')
		.select('*')
		.eq('name', serviceName)
		.single()

	if (error) {
		return Response.json({ message: error.message }, { status: 500 })
	}

	return Response.json(data)
}
