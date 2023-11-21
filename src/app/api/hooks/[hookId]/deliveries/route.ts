import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(
	req: NextRequest,
	{
		params: { hookId },
	}: {
		params: {
			hookId: string
		}
	},
) {
	const supabase = createClient(cookies())

	const { error: hookError, data: deliveries } = await supabase
		.from('hook_deliveries')
		.select('*')
		.eq('hook_id', hookId)

	if (hookError) {
		return Response.json({ message: hookError.message }, { status: 500 })
	}

	return Response.json(deliveries)
}
