'use client'

import { useToast } from '@/hooks/useToast'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WebhookForm } from '@/components/WebhookForm'
import { updateWebhook } from './actions'
import {
	Webhook,
	WebhookUpdate,
} from '@/services/client/webhooks/webhooks-types'

export function WebhookSettingsCard({ webhook }: { webhook: Webhook }) {
	const { showError } = useToast()

	const onSubmit = async (values: WebhookUpdate) => {
		try {
			await updateWebhook(webhook.id, values)
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
						name: webhook.name,
						description: webhook.description,
						event_types: webhook.event_types,
						url: webhook.url,
					}}
					onSubmit={onSubmit}
					buttonTitle="Update Webhook"
				/>
			</CardContent>
		</Card>
	)
}
