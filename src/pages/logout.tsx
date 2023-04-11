import { Button } from '@/components/Button'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Logout() {
	const router = useRouter()
	const supabaseClient = useSupabaseClient()
	const user = useUser()

	const logout = async () => {
		await supabaseClient.auth.signOut()
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{user ? (
				<>
					<Image
						src={
							user.user_metadata.internal_profile.avatar_url ||
							user.user_metadata.avatar_url
						}
						alt="User avatar"
						width={80}
						height={80}
						className="mb-4 rounded-full border-2 border-slate-400"
						priority
					/>
					<Button onClick={logout}>Logout</Button>
				</>
			) : (
				<>
					<p className="font-semibold mb-4">You are not logged!</p>
					<Button onClick={() => router.push('/login')}>Login</Button>
				</>
			)}
		</div>
	)
}
