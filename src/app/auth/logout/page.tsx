'use client'

import { Button } from '@/components/Button'
import { useUser } from '@/contexts/UserProvider'
import Image from 'next/image'
import { signOut } from './actions'

export default function Logout() {
	const user = useUser()

	return (
		<div className="flex flex-col items-center justify-center">
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
