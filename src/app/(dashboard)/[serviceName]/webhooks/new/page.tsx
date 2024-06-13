'use client'

import { useToast } from '@/hooks/useToast'
import { HookCreate } from '@/types/hooks'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WebhookForm } from '@/components/WebhookForm'
import { createWebhook } from './actions'

export default function NewApiKey({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const { showError } = useToast()

	const onSubmit = async (values: HookCreate) => {
		try {
			await createWebhook(serviceName, values)
		} catch (error) {
			showError(
				'Could not create webhook',
				error instanceof Error
					? error.message
					: 'Check your connection and try again',
			)
		}
	}

	return (
		<Card className="w-full max-w-xl text-slate-600">
			<CardHeader>
				<CardTitle>Create Webhook</CardTitle>
				<CardDescription>
					Get real-time notifications with POST - JSON in your backend.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<WebhookForm
					defaultValues={{
						name: '',
						description: undefined,
						url: '',
						event_types: ['invoice.paid'],
						secret: undefined,
					}}
					onSubmit={onSubmit}
					buttonTitle="Create Webhook"
				/>
			</CardContent>
		</Card>
	)
}
