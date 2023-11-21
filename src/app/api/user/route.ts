import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
	const supabase = createClient(cookies())

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session) {
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401,
			},
		)
	}

	const { data, error } = await supabase.from('profiles').select('*').single()

	if (error && error.code !== 'PGRST116') {
		return Response.json({ message: error.message }, { status: 403 })
	}

	if (!data) {
		// User has been deleted
		await supabase.auth.signOut()
		return Response.json({ message: 'user not found' }, { status: 403 })
	}

	return Response.json(data)
}
