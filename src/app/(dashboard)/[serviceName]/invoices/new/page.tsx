'use client'

import { useForm } from 'react-hook-form'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { TextArea } from '@/components/TextArea'
import { useTransition } from 'react'
import { createInvoice } from './actions'
import { InvoiceCreate, invoiceCreateSchema } from '@/services/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePreferences } from '@/contexts/PreferencesProvider'

export default function NewService({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const [isPending, startTransition] = useTransition()

	const { showError } = useToast()

	const { currentService } = usePreferences()

	const form = useForm<InvoiceCreate>({
		resolver: zodResolver(invoiceCreateSchema),
	})

	const onSubmit = async (fields: InvoiceCreate) => {
		startTransition(async () => {
			try {
				await createInvoice(serviceName, fields)
			} catch (error) {
				showError(
					"Couldn't create invoice",
					error instanceof Error
						? error.message
						: 'Check your connection and try again',
				)
			}
		})
	}

	if (!serviceName) {
		return null
	}

	if (!currentService) {
		return (
			<>
				<Container>
					<div>Something went wrong!</div>
				</Container>
			</>
		)
	}

	return (
		<Form {...form}>
			<form
				className="flex h-screen w-full max-w-xl flex-col items-center space-y-6 bg-white px-16 py-8 pb-16 shadow sm:mt-4 sm:h-auto sm:rounded-lg"
				onSubmit={form.handleSubmit(fields => onSubmit(fields))}
			>
				<div className="w-full max-w-xl space-y-4 px-4 pb-4 sm:px-8">
					<div className="flex w-full items-center justify-between space-x-8">
						<h1 className="text-lg font-semibold text-slate-600">
							New Invoice
						</h1>
						<div />
					</div>

					<FormField
						name="title"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Title"
										{...field}
										invalid={fieldState.invalid}
										className="capitalize"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<TextArea
										label="Description (optional)"
										{...field}
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="price"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Price / Amount"
										type="number"
										{...field}
										onChange={e =>
											field.onChange(Number(e.target.value) || undefined)
										}
										invalid={fieldState.invalid}
										autoCapitalize="words"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="recipient_address"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Recipient Nano Address"
										{...field}
										invalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="redirect_url"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Redirect URL (optional)"
										{...field}
										invalid={fieldState.invalid}
										type="url"
										value={field.value || ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					loading={form.formState.isSubmitting || isPending}
				>
					Create Invoice
				</Button>
			</form>
		</Form>
	)
}
