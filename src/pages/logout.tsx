import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthProvider'
import Image from 'next/image'

export default function Logout() {
	const { user, signOut } = useAuth()

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<>
				<Image
					src={user.avatar_url}
					alt="User avatar"
					width={80}
					height={80}
					className="mb-4 rounded-full border-2 border-slate-400"
					priority
				/>
				<Button onClick={signOut}>Logout</Button>
			</>
		</div>
	)
}
