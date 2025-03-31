'use client'
import { use } from 'react'

import { Container } from '@/components/Container'
import { useToast } from '@/hooks/useToast'
import { createInvoice } from './actions'
import { InvoiceCreate } from '@/core/client'
import { usePreferences } from '@/contexts/PreferencesProvider'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
import { InvoiceForm } from '@/components/InvoiceForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function NewService(props: {
	params: Promise<{
		serviceIdOrSlug: string
	}>
}) {
	const params = use(props.params)
	const { showError } = useToast()

	const { currentService } = usePreferences()

	const { executeAsync } = useAction(createInvoice, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError("Couldn't create invoice", message)
		},
	})

	const onSubmit = async (fields: InvoiceCreate) => {
		await executeAsync({
			...fields,
			serviceIdOrSlug: params.serviceIdOrSlug,
		})
	}

	if (!currentService) {
		return (
			<>
				<Container>
					<div>No current service!</div>
				</Container>
			</>
		)
	}

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>New Invoice</CardTitle>
				<CardDescription>
					Create a new invoice for your customers
				</CardDescription>
			</CardHeader>
			<CardContent>
				<InvoiceForm onSubmit={onSubmit} />
			</CardContent>
		</Card>
	)
}
