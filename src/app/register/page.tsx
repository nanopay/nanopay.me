import { createClient } from '@/utils/supabase/server'
import RegisterForm from './register-form'
import { cookies } from 'next/headers'
import { DEFAULT_AVATAR_URL } from '@/constants'
import api from '@/services/api'
import { redirect } from 'next/navigation'

export default async function RegisterUser() {
	const supabase = createClient(cookies())

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		throw new Error('No user data')
	}

	try {
		const userProfile = await api.users.retrieve({
			headers: {
				Cookie: cookies().toString(),
			},
		})

		if (!!userProfile) {
			// Register is already done
			redirect('/home')
		}
	} catch (error) {
		if (!(error instanceof Error) || error.message !== 'user not found') {
			throw error
		}
	}

	if (!session.user) {
		throw new Error('No user data')
	}

	if (!session.user.email) {
		throw new Error('No user email')
	}

	return (
		<RegisterForm
			initialData={{
				email: session.user.email,
				name: session.user.user_metadata.full_name,
				avatar_url: session.user.user_metadata.avatar_url || DEFAULT_AVATAR_URL,
			}}
		/>
	)
}
