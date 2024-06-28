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
import { useRouter } from 'next/navigation'
import { useAction } from '@/hooks/useAction'
import { useToast } from '@/hooks/useToast'

export function LogoutCard({ hasPrevious }: { hasPrevious: boolean }) {
	const router = useRouter()

	const { showError } = useToast()

	const { execute: handleLogout, isExecuting } = useAction(
		async () => {
			return await signOut()
		},
		{
			onError: error => {
				showError(error.message)
			},
		},
	)

	const handleCancel = () => {
		hasPrevious ? router.back() : router.push('/')
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
					loading={isExecuting}
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
