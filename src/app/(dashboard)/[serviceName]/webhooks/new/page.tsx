'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'
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
import api from '@/services/api'

export default function NewApiKey({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const { mutateAsync: onSubmit, isSuccess } = useMutation({
		mutationFn: async (data: HookCreate) =>
			api.services.hooks.create(serviceName, data),
		onSuccess: () => {
			showSuccess('Webhook created')
			router.push(`/${serviceName}/webhooks`)
		},
		onError: (err: any) => {
			showError(
				'Error creating webhook',
				api.getErrorMessage(err) || 'Try again Later',
			)
		},
	})

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
					disabled={isSuccess}
				/>
			</CardContent>
		</Card>
	)
}
