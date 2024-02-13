'use client'

import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { JSONSchemaType } from 'ajv'
import { sanitizeSlug } from '@/utils/url'
import {
	Autocomplete,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material'
import { HookCreate } from '@/types/hooks'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/Button'

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
				enum: ['invoice.paid', 'invoice.error', 'invoice.expired'],
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

export default function NewApiKey({
	params: { serviceName },
}: {
	params: {
		serviceName: string
	}
}) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		watch,
	} = useForm<HookCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
		defaultValues: {
			name: '',
			description: undefined,
			url: '',
			event_types: ['invoice.paid'],
			secret: undefined,
		},
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
	} = useMutation({
		mutationFn: async (data: HookCreate) =>
			api.services.hooks.create(serviceName, data),
		onSuccess: () => {
			showSuccess('Webhook created')
			router.push(`/${serviceName}/hooks`)
		},
		onError: (err: any) => {
			showError(
				'Error creating webhook',
				api.getErrorMessage(err) || 'Try again Later',
			)
		},
	})

	if (!serviceName) {
		return null
	}

	const onErrorSubmiting = () => {
		showError('Error creating Webhook', 'Check the fields entered')
	}

	const handleEventType = (e: any) => {
		const currentValues = getValues('event_types')
		const item = (e.target as HTMLInputElement).value
		if (currentValues.includes(item)) {
			setValue(
				'event_types',
				currentValues.filter(i => i !== item),
			)
		} else {
			setValue('event_types', [...currentValues, item])
		}
	}

	return (
		<>
			<Head>
				<title>New API Key - NanoPay.me</title>
			</Head>
			<form
				className="flex w-full max-w-2xl flex-1 flex-col items-center rounded-lg bg-white px-8 pb-8 shadow"
				onSubmit={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
			>
				<div className="mb-8 flex w-full items-center justify-center space-x-2 border-b border-slate-200 py-3">
					<h3 className="text-lg font-semibold text-slate-700">
						Create a Webhook
					</h3>
				</div>

				<div className="flex w-full flex-col gap-y-4 px-4 py-4 sm:px-8">
					<div>
						<div className="mb-2 flex items-center text-xs text-gray-600">
							<InfoIcon className="mr-1 w-4" />
							<div>
								Use a name like:{' '}
								<span className="font-semibold">my-webhook</span>
								{' or '}
								<span className="font-semibold">mywebsite.com</span>
							</div>
						</div>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<Input
									label="Name"
									{...field}
									onChange={e => field.onChange(sanitizeSlug(e.target.value))}
									errorMessage={errors.name?.message}
									className="w-full"
									autoCapitalize="words"
									style={{
										textTransform: 'capitalize',
									}}
									disabled={isSubmitting || isSuccess}
								/>
							)}
						/>
					</div>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<Input
								label="Description"
								{...field}
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								errorMessage={errors.description?.message}
								className="w-full"
								multiline={true}
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="url"
						control={control}
						render={({ field }) => (
							<Input
								label="Hook URL"
								{...field}
								type="url"
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								errorMessage={errors.url?.message}
								className="w-full"
								disabled={isSubmitting || isSuccess}
							/>
						)}
					/>

					<Controller
						name="event_types"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormLabel id="demo-row-radio-buttons-group-label">
									Event Types
								</FormLabel>
								<RadioGroup
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="row-radio-buttons-group"
									className="flex justify-between text-gray-600"
								>
									<FormControlLabel
										value="invoice.paid"
										control={<Radio onClick={handleEventType} />}
										label="Invoice Paid"
										checked={field.value.includes('invoice.paid')}
										disabled={isSubmitting || isSuccess}
									/>
									<FormControlLabel
										disabled
										value="invoice.error"
										control={<Radio onClick={handleEventType} />}
										label="Invoice Error"
										checked={field.value.includes('invoice.error')}
									/>
									<FormControlLabel
										disabled
										value="invoice.expired"
										control={<Radio onClick={handleEventType} />}
										label="Invoice Expired"
										checked={field.value.includes('invoice.expired')}
									/>
								</RadioGroup>
							</FormControl>
						)}
					/>

					<div className="flex justify-between">
						<Autocomplete
							options={['POST']}
							id="method"
							readOnly
							defaultValue={'POST'}
							renderInput={params => (
								<TextField {...params} label="Method" variant="standard" />
							)}
							className="w-32"
							disabled
						/>
						<Autocomplete
							options={['application/json']}
							id="method"
							readOnly
							defaultValue={'application/json'}
							renderInput={params => (
								<TextField
									{...params}
									label="Content Type"
									variant="standard"
								/>
							)}
							className="w-64"
							disabled
						/>
					</div>

					<Controller
						name="secret"
						control={control}
						render={({ field }) => (
							<Input
								label="Secret (optional)"
								{...field}
								onChange={e => field.onChange(e.target.value.slice(0, 512))}
								errorMessage={errors.secret?.message}
								className="w-full"
								disabled={true || isSubmitting || isSuccess}
							/>
						)}
					/>
					<div className="my-2 rounded border border-yellow-300 bg-yellow-100 p-2 text-sm">
						<h4 className="font-semibold">Important:</h4>
						<ul>
							<li>
								- Only the events of the next invoices will be delivered for
								this webhook
							</li>
							<li>
								- If your webhook does not respond with a valid code within 15
								seconds, we cancel the request. We do not implement retries.
							</li>
						</ul>
					</div>
				</div>
				<Button
					type="submit"
					loading={isSubmitting}
					disabled={
						isSuccess ||
						!watch('name') ||
						!watch('url') ||
						!watch('event_types') ||
						watch('event_types').length < 1
					}
				>
					Create Webhook
				</Button>
			</form>
		</>
	)
}
