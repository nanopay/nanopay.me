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

const defaultValues = {
	title: 'Demo Invoice',
	description: 'This is a demo invoice',
	price: 0.01,
	recipient_address:
		'nano_1rixy1tbyf3rjqynmujbrpkmkxtcndm79ar9dhzebx115arsd7keb5zkzfp9',
	redirect_url: 'https://nano.org',
}

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
				<InvoiceForm onSubmit={onSubmit} defaultValues={defaultValues} />
			</CardContent>
		</Card>
	)
}
