import { supabase } from '@/lib/supabase'
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
	const { error: authError } = await supabase.authWithCookies(req.cookies)

	if (authError) {
		return Response.json({ message: authError.message }, { status: 401 })
	}

	const { data, error } = await supabase
		.from('api_keys')
		.select('*')
		.eq('name', serviceName)
		.single()

	if (error) {
		return Response.json({ message: error.message }, { status: 500 })
	}

	return Response.json(data)
}
