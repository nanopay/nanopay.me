'use client'

import { signOut } from './actions'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/Button'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function LogoutCard({ hasPrevious }: { hasPrevious: boolean }) {
	const [isPending, startTransition] = useTransition()

	const router = useRouter()

	const handleLogout = async () => {
		startTransition(signOut)
	}

	const handleCancel = () => {
		hasPrevious ? router.back() : router.push('/home')
	}

	return (
		<Card className="border-none shadow-none">
			<CardHeader>
				<CardTitle>Logout from NanoPay.me?</CardTitle>
				<CardDescription>You can log back in at any time</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<Button
					size="lg"
					className="w-full text-lg"
					onClick={handleLogout}
					loading={isPending}
				>
					Logout
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="w-full text-lg"
					onClick={handleCancel}
				>
					Cancel
				</Button>
			</CardContent>
		</Card>
	)
}
