'use client'

import { useToast } from '@/hooks/useToast'
import { Hook, HookCreate } from '@/types/hooks'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WebhookForm } from '@/components/WebhookForm'
import { updateWebhook } from './actions'

export function WebhookSettingsCard({ hook }: { hook: Hook }) {
	const { showError } = useToast()

	const onSubmit = async (values: HookCreate) => {
		try {
			await updateWebhook(hook.id, values)
		} catch (error) {
			showError(
				'Could not update webhook',
				error instanceof Error
					? error.message
					: 'Check your connection and try again',
			)
		}
	}

	return (
		<Card className="w-full max-w-xl text-slate-600">
			<CardHeader>
				<CardTitle>Update Webhook</CardTitle>
				<CardDescription>
					Get real-time notifications with <b>POST - JSON</b> in your backend.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<WebhookForm
					defaultValues={{
						name: hook.name,
						description: hook.description,
						event_types: hook.event_types,
						url: hook.url,
					}}
					onSubmit={onSubmit}
					buttonTitle="Update Webhook"
				/>
			</CardContent>
		</Card>
	)
}
