'use client'

import { useToast } from '@/hooks/useToast'
import { Controller, useForm } from 'react-hook-form'
import {
	Autocomplete,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
} from '@mui/material'
import Input from '@/components/Input'
import { sanitizeSlug } from '@/utils/url'
import { Hook, HookCreate } from '@/types/hooks'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { JSONSchemaType } from 'ajv'
import api from '@/services/api'
import { useMutation } from 'react-query'
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

export function HookForm({ hook }: { hook: Hook }) {
	const { showError, showSuccess } = useToast()
	const {
		control,
		handleSubmit,
		formState: { errors, isDirty },
		setValue,
		getValues,
	} = useForm<HookCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
		defaultValues: {
			name: hook.name,
			description: hook.description,
			event_types: hook.event_types,
			url: hook.url,
		},
	})

	const { mutate: onSubmit, isLoading: isSubmitting } = useMutation({
		mutationFn: async (data: HookCreate) =>
			api.services.hooks.update(hook.id, data),
		onSuccess: () => {
			showSuccess('Webhook updated')
		},
		onError: (err: any) => {
			showError(
				'Error updating webhook',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

	const onErrorSubmiting = (err: any) => {
		console.log(JSON.stringify(err, null, 2))
		showError('Error updating Webhook', 'Check the fields entered')
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
		<form
			className="flex w-full max-w-2xl flex-col items-center rounded-lg bg-white px-6 pb-8 shadow sm:px-8 xl:max-w-7xl"
			onSubmit={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
		>
			<div className="mb-8 flex w-full items-center justify-center space-x-2 border-b border-slate-200 py-3">
				<h3 className="text-lg font-semibold text-slate-700">Manage Webhook</h3>
			</div>

			<div className="flex w-full flex-col gap-4 py-4 xl:flex-row xl:gap-16">
				<div className="w-full space-y-4 xl:w-1/2">
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
								disabled={isSubmitting}
							/>
						)}
					/>

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
								disabled={isSubmitting}
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
								disabled={isSubmitting}
							/>
						)}
					/>
				</div>

				<div className="w-full space-y-2 xl:w-1/2">
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
									className="flex justify-between text-slate-600"
								>
									<FormControlLabel
										value="invoice.paid"
										control={<Radio onClick={handleEventType} />}
										label="Invoice Paid"
										checked={field.value.includes('invoice.paid')}
										disabled={isSubmitting}
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
								disabled={true || isSubmitting}
							/>
						)}
					/>
				</div>
			</div>
			<div className="flex w-full justify-end">
				<Button type="submit" loading={isSubmitting} disabled={!isDirty}>
					{isSubmitting ? 'Updating Webhook...' : 'Update Webhook'}
				</Button>
			</div>
		</form>
	)
}
