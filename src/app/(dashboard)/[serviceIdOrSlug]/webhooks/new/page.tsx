'use client'
import { use } from 'react'

import { useToast } from '@/hooks/useToast'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { WebhookForm } from '@/components/WebhookForm'
import { createWebhook } from './actions'
import { WebhookCreate } from '@/core/client'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

export default function NewWebhookPage(props: {
	params: Promise<{
		serviceIdOrSlug: string
	}>
}) {
	const params = use(props.params)

	const { serviceIdOrSlug } = params

	const { showError } = useToast()

	const { executeAsync: executeCreateWebhook } = useAction(createWebhook, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Could not create webhook', message)
		},
	})

	const onSubmit = async (values: WebhookCreate) => {
		await executeCreateWebhook({
			serviceIdOrSlug: serviceIdOrSlug,
			...values,
		})
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
