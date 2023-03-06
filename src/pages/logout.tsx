import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Logout() {
	const router = useRouter()

	const { status } = useSession()

	useEffect(() => {
		if (status === 'authenticated') {
			signOut().then(() => {
				router.push('/login')
			})
		} else {
			router.push('/login')
		}
	}, [status])

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="text-2xl font-bold">Logging out...</div>
		</div>
	)
}
