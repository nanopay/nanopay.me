'use client'

import { Button } from '@/components/Button'
import { deleteApiKey } from './actions'
import { useAction } from 'next-safe-action/hooks'
import { useToast } from '@/hooks/useToast'
import { getSafeActionError } from '@/lib/safe-action'

export default function DeleteApiKeyButton({ checksum }: { checksum: string }) {
	const { showError } = useToast()

	const { executeAsync, isExecuting } = useAction(deleteApiKey, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Could not delete API key', message)
		},
	})

	return (
		<Button
			onClick={async () => {
				await executeAsync(checksum)
			}}
			variant="destructive"
			size="sm"
			loading={isExecuting}
		>
			Delete
		</Button>
	)
}
