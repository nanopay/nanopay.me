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
import { useToast } from '@/hooks/useToast'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

export function LogoutCard({ hasPrevious }: { hasPrevious: boolean }) {
	const router = useRouter()

	const { showError } = useToast()

	const { executeAsync: handleLogout, isExecuting } = useAction(signOut, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError(message)
		},
	})

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
					onClick={() => handleLogout()}
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
