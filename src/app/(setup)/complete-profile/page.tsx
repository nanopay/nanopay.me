import { createClient } from '@/utils/supabase/server'
import CompleteProfileForm from './complete-profile-form'
import { cookies } from 'next/headers'
import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { redirect } from 'next/navigation'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Logomark } from '@/components/Logo'
import { Client } from '@/core/client'

async function checkUserProfileExists(): Promise<boolean> {
	const client = new Client(cookies())
	const profile = await client.user.getProfile()
	return !!profile
}

export default async function CompleteUserProfile() {
	const supabase = createClient(cookies())

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		throw new Error('No user data')
	}

	if (!session.user.email) {
		throw new Error('No user email')
	}

	const userProfileExists = await checkUserProfileExists()

	if (userProfileExists) {
		redirect('/')
	}

	return (
		<Card className="flex h-full w-full flex-1 flex-col overflow-hidden sm:h-auto sm:max-w-md">
			<CardHeader className="mb-6 flex flex-col items-center border-b border-slate-200 py-4">
				<CardTitle className="text-lg font-medium text-slate-600">
					Complete your profile
				</CardTitle>
				<CardDescription>
					You are signed in as <b>{session.user.email}</b>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col items-center justify-center">
				<CompleteProfileForm
					initialData={{
						name: session.user.user_metadata.full_name,
					}}
				/>
			</CardContent>
		</Card>
	)
}
