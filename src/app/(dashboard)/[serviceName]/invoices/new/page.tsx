'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import { JSONSchemaType } from 'ajv'

import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { InvoiceCreate } from '@/types/invoice'
import { INVOICE_MINIMUM_PRICE } from '@/constants'
import { usePreferences } from '@/contexts/PreferencesProvider'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { TextArea } from '@/components/TextArea'

const schema: JSONSchemaType<InvoiceCreate> = {
	type: 'object',
	properties: {
		title: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		price: { type: 'number', minimum: INVOICE_MINIMUM_PRICE },
		recipient_address: {
			type: 'string',
			pattern: '^nano_[13456789abcdefghijkmnopqrstuwxyz]{60}$',
		},
		metadata: { type: 'object', nullable: true },
		redirect_url: {
			type: 'string',
			format: 'uri',
			maxLength: 512,
			nullable: true,
		},
	},
	required: ['title', 'price', 'recipient_address'],
	additionalProperties: false,
}

export default function NewService({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const router = useRouter()

	const { showError, showSuccess } = useToast()

	const { currentService } = usePreferences()

	const form = useForm<InvoiceCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
	} = useMutation({
		mutationFn: async (data: InvoiceCreate) =>
			api.invoices.create(currentService?.name as string, data),
		onSuccess: res => {
			showSuccess('Invoice created')
			router.push(`/${currentService?.name}/invoices/${res.id}`)
		},
		onError: (err: any) => {
			showError(
				'Error creating invoice',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

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
										invalid={fieldState.invalid}
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
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					loading={isSubmitting}
					disabled={form.formState.isSubmitting || isSuccess}
				>
					Create Invoice
				</Button>
			</form>
		</Form>
	)
}
