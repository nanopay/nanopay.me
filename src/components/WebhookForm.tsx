import { Button } from '@/components/Button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { sanitizeSlug } from '@/utils/url'
import Input from '@/components/Input'
import { AlertCircle, InfoIcon } from 'lucide-react'
import { UseFormProps, useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TextArea } from './TextArea'
import {
	WebhookCreate,
	WebhookEventType,
} from '@/core/client/webhooks/webhooks-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { webhookCreateSchema } from '@/core/client'

const eventTypes: WebhookEventType[] = [
	'invoice.paid',
	'invoice.created',
	'invoice.error',
	'invoice.expired',
]

export interface WebhookFormProps extends UseFormProps<WebhookCreate> {
	onSubmit: (fields: WebhookCreate) => void
	buttonTitle: string
}

export function WebhookForm({
	onSubmit,
	buttonTitle,
	...props
}: WebhookFormProps) {
	const { ...form } = useForm<WebhookCreate>({
		resolver: zodResolver(webhookCreateSchema),
		...props,
	})

	const formDisabled = form.formState.isSubmitting || form.formState.disabled
	const requiredFieldsAreDirty = !form.watch('name') || !form.watch('url')
	const buttonDisabled = formDisabled || requiredFieldsAreDirty

	return (
		<Form {...form}>
			<form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									label="Name"
									{...field}
									onChange={e => field.onChange(sanitizeSlug(e.target.value))}
									required
									className="capitalize"
									disabled={formDisabled}
								/>
							</FormControl>
							<FormDescription className="flex items-center text-xs text-slate-600">
								<InfoIcon className="mr-1 w-4" />
								<>
									Use a name like:{' '}
									<span className="font-semibold">my-webhook</span>
									{' or '}
									<span className="font-semibold">mywebsite.com</span>
								</>
							</FormDescription>
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
									label="Description"
									{...field}
									value={field.value ?? ''}
									onChange={e => field.onChange(e.target.value.slice(0, 512))}
									invalid={fieldState.invalid}
									disabled={formDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="url"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									label="Hook URL"
									{...field}
									required
									type="url"
									onChange={e => field.onChange(e.target.value.slice(0, 512))}
									disabled={formDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="event_types"
					control={form.control}
					render={({ field }) => (
						<FormItem className="space-y-2">
							<FormLabel>Event Types</FormLabel>
							<FormControl>
								<RadioGroup className="flex space-x-4" aria-multiselectable>
									{eventTypes.map(eventType => (
										<div
											className="flex items-center space-x-2"
											key={eventType}
										>
											<RadioGroupItem
												value={eventType}
												id={eventType}
												checked={field.value.includes(eventType)}
												disabled={formDisabled}
											/>
											<Label htmlFor={eventType}>{eventType}</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="secret"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									label="Secret (optional)"
									{...field}
									value={field.value ?? ''}
									onChange={e => field.onChange(e.target.value.slice(0, 512))}
									disabled
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.formState.dirtyFields.url && <WebhookAlert />}

				<Button
					type="submit"
					loading={form.formState.isSubmitting}
					disabled={buttonDisabled}
					className="mt-2"
				>
					{buttonTitle}
				</Button>
			</form>
		</Form>
	)
}

function WebhookAlert() {
	return (
		<Alert className="border-yellow-200 bg-yellow-50">
			<AlertCircle className="h-4 w-4 !text-yellow-800" />
			<AlertTitle className="text-yellow-800">Important</AlertTitle>
			<AlertDescription className="text-yellow-900">
				<ul className="list-disc">
					<li>
						Only the events of the next invoices will be delivered for this
						webhook
					</li>
					<li>
						If your webhook does not respond with a valid code within 15
						seconds, we cancel the request. We do not implement retries
						currently.
					</li>
				</ul>
			</AlertDescription>
		</Alert>
	)
}
