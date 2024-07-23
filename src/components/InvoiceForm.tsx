import { InvoiceCreate, invoiceCreateSchema } from '@/core/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormProps } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { TextArea } from './TextArea'
import Input from './Input'
import { Button } from './Button'

export interface InvoiceFormProps extends UseFormProps<InvoiceCreate> {
	onSubmit: (fields: InvoiceCreate) => void
}

export function InvoiceForm({ onSubmit, ...props }: InvoiceFormProps) {
	const form = useForm<InvoiceCreate>({
		resolver: zodResolver(invoiceCreateSchema),
		...props,
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(fields => onSubmit(fields))}>
				<div className="w-full space-y-4 pb-4">
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

				<div className="flex justify-center">
					<Button
						type="submit"
						loading={form.formState.isSubmitting}
						disabled={form.formState.isSubmitSuccessful}
						className="w-[60%] text-lg"
						size="lg"
					>
						Create Invoice
					</Button>
				</div>
			</form>
		</Form>
	)
}
