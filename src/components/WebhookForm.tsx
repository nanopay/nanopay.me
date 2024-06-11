import { Button } from '@/components/Button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
	Form,
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
import { fullFormats } from 'ajv-formats/dist/formats'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { HookCreate } from '@/types/hooks'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const eventTypes = ['invoice.paid', 'invoice.error', 'invoice.expired']

const schema: JSONSchemaType<HookCreate> = {
	type: 'object',
	properties: {
		name: {
			type: 'string',
			minLength: 2,
			maxLength: 24,
			pattern: '^[a-zA-Z0-9-.]+$',
		},
		description: { type: 'string', maxLength: 512, nullable: true },
		url: {
			type: 'string',
			format: 'uri',
			maxLength: 512,
		},
		event_types: {
			type: 'array',
			items: {
				type: 'string',
				enum: eventTypes,
			},
			minItems: 1,
		},
		secret: {
			type: 'string',
			minLength: 8,
			maxLength: 256,
			nullable: true,
		},
	},
	required: ['name', 'url', 'event_types'],
	additionalProperties: false,
}

export interface WebhookFormProps extends UseFormProps<HookCreate> {
	onSubmit: (fields: HookCreate) => void
	buttonTitle: string
}

export function WebhookForm({
	onSubmit,
	buttonTitle,
	...props
}: WebhookFormProps) {
	const { ...form } = useForm<HookCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
		...props,
	})

	const formDisabled = form.formState.isSubmitting || form.formState.disabled
	const requiredFieldsAreDirty = !form.watch('name') || !form.watch('url')
	const buttonDisabled = formDisabled || requiredFieldsAreDirty

	return (
		<Form {...form}>
			<form
				className="flex w-full flex-1 flex-col gap-y-2"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<Input
								label="Name"
								{...field}
								onChange={e => field.onChange(sanitizeSlug(e.target.value))}
								required
								className="w-full"
								autoCapitalize="words"
								style={{
									textTransform: 'capitalize',
								}}
								disabled={formDisabled}
							/>
							<FormDescription className="flex items-center text-xs text-slate-600">
								<InfoIcon className="mr-1 w-4" />
								<div>
									Use a name like:{' '}
									<span className="font-semibold">my-webhook</span>
									{' or '}
									<span className="font-semibold">mywebsite.com</span>
								</div>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="description"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<Input
								label="Description"
								{...field}
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								className="w-full"
								multiline={true}
								disabled={formDisabled}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="url"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<Input
								label="Hook URL"
								{...field}
								required
								type="url"
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								className="w-full"
								disabled={formDisabled}
							/>
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
							<RadioGroup className="flex space-x-4" aria-multiselectable>
								{eventTypes.map(eventType => (
									<div className="flex items-center space-x-2" key={eventType}>
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
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="secret"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<Input
								label="Secret (optional)"
								{...field}
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								className="w-full"
								disabled={true}
							/>
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