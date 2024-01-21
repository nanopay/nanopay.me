import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')
	const next = requestUrl.searchParams.get('next')

	if (!code) {
		return NextResponse.json(
			{
				error: 'code is missing',
			},
			{
				status: 400,
			},
		)
	}

	const supabase = createClient(cookies())
	await supabase.auth.exchangeCodeForSession(code)

	const redirectTo = new URL(requestUrl.origin)
	redirectTo.pathname = next || '/home'

	return NextResponse.redirect(redirectTo.toString())
}
