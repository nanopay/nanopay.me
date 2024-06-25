'use client'

import { Button } from '@/components/Button'
import { deleteApiKey } from './actions'

export default function DeleteApiKeyButton({ apiKeyId }: { apiKeyId: string }) {
	return (
		<Button
			onClick={async () => {
				await deleteApiKey(apiKeyId)
			}}
			variant="destructive"
			size="sm"
		>
			Delete
		</Button>
	)
}
