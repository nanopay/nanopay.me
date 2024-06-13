'use client'

import { useToast } from '@/hooks/useToast'
import { Hook, HookCreate } from '@/types/hooks'
import api from '@/services/api'
import { useMutation } from 'react-query'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WebhookForm } from '@/components/WebhookForm'

export function WebhookSettingsCard({ hook }: { hook: Hook }) {
	const { showError, showSuccess } = useToast()

	const { mutateAsync: onSubmit } = useMutation({
		mutationFn: async (data: HookCreate) =>
			api.services.hooks.update(hook.id, data),
		onSuccess: () => {
			showSuccess('Webhook updated')
		},
		onError: (err: any) => {
			showError(
				'Error updating webhook',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

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
