import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import MButton from '@/components/MButton'
import { Controller, useForm } from 'react-hook-form'
import {
	Autocomplete,
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Skeleton,
	Tab,
	Tabs,
	TextField,
} from '@mui/material'
import Input from '@/components/Input'
import { sanitizeSlug } from '@/utils/helpers'
import { Hook, HookCreate } from '@/types/hooks'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { JSONSchemaType } from 'ajv'
import tailwindColors from 'tailwindcss/colors'
import Link from 'next/link'

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

export default function Webhooks({
	params: { serviceName, hookId },
}: {
	params: {
		serviceName: string
		hookId: string
	}
}) {
	const { showError } = useToast()

	const tabs = [
		{
			label: 'Settings',
			href: `/services/${serviceName}/hooks/${hookId}`,
		},
		{
			label: 'Deliveries',
			href: `/services/${serviceName}/hooks/${hookId}/deliveries`,
		},
	]

	const { data: hook } = useQuery({
		queryKey: ['hooks', hookId],
		queryFn: () => api.services.hooks.get(hookId).then(res => res.data),
		enabled: !!serviceName && !!hookId,
		onError: (err: any) => {
			showError(
				'Fail getting hook',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

	if (!serviceName || !hookId) {
		return null
	}

	return (
		<>
			<Head>
				<title>Webooks - NanoPay.me</title>
			</Head>
			<Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
				<Tabs value={0}>
					{tabs.map((tab, index) => (
						<Tab
							key={index}
							label={tab.label}
							href={tab.href}
							LinkComponent={Link}
						/>
					))}
				</Tabs>
			</Box>
			{!hook ? (
				<Skeleton
					variant="rectangular"
					animation="wave"
					width="full"
					height={240}
					className="rounded-lg"
					sx={{ bgcolor: tailwindColors.slate['200'] }}
				/>
			) : (
				<HookForm hook={hook} />
			)}
		</>
	)
}

const HookForm = ({ hook }: { hook: Hook }) => {
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
			api.services.hooks.update(hook.id, data).then(res => res.data),
		onSuccess: () => {
			showSuccess('Webhook updated')
		},
		onError: (err: any) => {
			showError('Error updating webhook', api.getErrorMessage(err))
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
			className="w-full bg-white flex flex-col items-center px-6 sm:px-8 pb-8 rounded-lg max-w-2xl xl:max-w-7xl shadow"
			onSubmit={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
		>
			<div className="w-full flex justify-center items-center space-x-2 py-3 mb-8 border-b border-slate-200">
				<h3 className="text-slate-700 text-lg font-semibold">Manage Webhook</h3>
			</div>

			<div className="w-full flex flex-col xl:flex-row xl:gap-16 gap-4 py-4">
				<div className="w-full xl:w-1/2 space-y-4">
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

				<div className="w-full xl:w-1/2 space-y-2">
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
									className="text-gray-600 flex justify-between"
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
			<div className="w-full flex justify-end">
				<MButton type="submit" loading={isSubmitting} disabled={!isDirty}>
					{isSubmitting ? 'Updating Webhook...' : 'Update Webhook'}
				</MButton>
			</div>
		</form>
	)
}
