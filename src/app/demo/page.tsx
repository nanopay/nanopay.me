'use client'

import { InvoiceForm } from '@/components/InvoiceForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'
import { getSafeActionError } from '@/lib/safe-action'
import { useAction } from 'next-safe-action/hooks'
import { createDemoInvoice } from './actions'

export default function Demo() {
	const { showError } = useToast()

	const { executeAsync: onSubmit } = useAction(createDemoInvoice, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError("Couldn't create invoice", message)
		},
	})

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<CardTitle>New Invoice</CardTitle>
				<CardDescription>
					Create a new invoice for demonstration
				</CardDescription>
			</CardHeader>
			<CardContent>
				<InvoiceForm onSubmit={onSubmit} />
			</CardContent>
		</Card>
	)
}
