import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { UserProfile } from '@/types/users'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { JSONSchemaType } from 'ajv'
import Layout from '@/components/Layout'
import { sanitizeSlug } from '@/utils/helpers'
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
import MButton from '@/components/MButton'

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

export default function NewApiKey({ user }: { user: UserProfile }) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const serviceName = router.query.serviceName as string

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
			api.services.hooks.create(serviceName, data).then(res => res.data),
		onSuccess: () => {
			showSuccess('Webhook created')
		},
		onError: (err: any) => {
			showError('Error creating webhook', api.getErrorMessage(err))
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
			<Layout user={user}>
				<form
					className="w-full bg-white flex flex-col flex-1 items-center px-8 pb-8 rounded-lg max-w-2xl shadow"
					onSubmit={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
				>
					<div className="w-full flex justify-center items-center space-x-2 py-3 mb-8 border-b border-slate-200">
						<h3 className="text-slate-700 text-lg font-semibold">
							Create a Webhook
						</h3>
					</div>

					<div className="w-full flex flex-col gap-y-4 px-4 sm:px-8 py-4">
						<div>
							<div className="flex mb-2 items-center text-xs text-gray-600">
								<InformationCircleIcon className="w-4 mr-1" />
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
										className="text-gray-600"
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
					</div>
					<MButton
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
						{isSubmitting ? 'Creating Webhook...' : 'Create Webhook'}
					</MButton>
				</form>
			</Layout>
		</>
	)
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createServerSupabaseClient(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	return {
		props: {
			user: session?.user?.user_metadata?.internal_profile || {
				name: 'error',
				email: 'error',
				avatar_url: 'error',
			},
		},
	}
}
