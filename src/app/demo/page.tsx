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
import { useRouter } from 'next/navigation'

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
	const router = useRouter()

	const { executeAsync: onSubmit } = useAction(createDemoInvoice, {
		onSuccess: ({ data }) => {
			if (data) {
				router.push(`/invoices/${data.id}`)
			}
		},
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError("Couldn't create invoice", message)
		},
	})

	return (
		<Card className="w-full max-w-lg">
			<CardHeader className="relative">
				<CardTitle className="flex justify-between space-x-2">
					New Invoice
					<span className="w-fit rounded-full border border-yellow-600 px-3 py-1 text-base font-bold text-yellow-600">
						DEMO
					</span>
				</CardTitle>
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
