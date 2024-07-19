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
import { Webhook, WebhookUpdate } from '@/core/client/webhooks/webhooks-types'
import { getSafeActionError } from '@/lib/safe-action'
import { useAction } from 'next-safe-action/hooks'

export function WebhookSettingsCard({ webhook }: { webhook: Webhook }) {
	const { showError } = useToast()

	const { executeAsync: executeUpdateWebhook } = useAction(updateWebhook, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Could not update webhook', message)
		},
	})

	const onSubmit = (values: WebhookUpdate) => {
		executeUpdateWebhook({
			webhookId: webhook.id,
			...values,
		})
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
