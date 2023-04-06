import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMutation, useQuery } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'

import { Container } from '@/components/Container'
import MButton from '@/components/MButton'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { ApiKeyCreate } from '@/types/services'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Header } from '@/components/Header'
import { UserProfile } from '@/types/users'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'
import { JSONSchemaType } from 'ajv'
import Image from 'next/image'
import {
	ChevronRightIcon,
	DocumentDuplicateIcon,
} from '@heroicons/react/24/solid'
import { Roboto } from '@next/font/google'
import clsx from 'clsx'
import Layout from '@/components/Layout'

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
})

const schema: JSONSchemaType<Omit<ApiKeyCreate, 'service'>> = {
	type: 'object',
	properties: {
		name: {
			type: 'string',
			minLength: 2,
			maxLength: 24,
			pattern: '^[a-zA-Z0-9-.]+$',
		},
		description: { type: 'string', maxLength: 512 },
	},
	required: ['name'],
	additionalProperties: false,
}

export default function NewApiKey({ user }: { user: UserProfile }) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const serviceName = router.query.serviceName as string

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ApiKeyCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
		data: createdApiKey,
	} = useMutation({
		mutationFn: async (data: ApiKeyCreate) =>
			api.services.apiKeys
				.create(serviceName, {
					...data,
					service: serviceName,
				})
				.then(res => res.data),
		onSuccess: () => {
			showSuccess('API Key created')
		},
		onError: (err: any) => {
			showError('Error creating service', api.getErrorMessage(err))
		},
	})

	if (!serviceName) {
		return null
	}

	const onErrorSubmiting = () => {
		showError('Error creating service', 'Check the fields entered')
	}

	const sanitizeName = (name: string) => {
		// only allows lowercase letters, numbers, dashes, underscores and dots
		return name.slice(0, 40).replace(/[^a-z0-9-_\.]/g, '')
	}

	const copy = (text: string) => {
		if (createdApiKey) {
			navigator.clipboard.writeText(text)
			showSuccess('Copied to clipboard', undefined, {
				autoClose: 1000,
			})
		}
	}

	return (
		<>
			<Head>
				<title>New API Key - NanoPay.me</title>
			</Head>
			<Layout user={user}>
				<div className="w-full bg-white flex flex-col flex-1 items-center px-8 pb-8 rounded-lg max-w-2xl shadow">
					<div className="w-full flex justify-center items-center space-x-2 py-3 mb-8 border-b border-slate-200">
						<h3 className="text-slate-700 text-lg font-semibold">
							Create a new key
						</h3>
					</div>

					<div className="w-full flex flex-col space-y-6 px-4 sm:px-8 py-4">
						<div>
							<div className="flex mb-2 items-center text-xs text-gray-600">
								<InformationCircleIcon className="w-4 mr-1" />
								<div>
									Use a name like:{' '}
									<span className="font-semibold">my-token</span>
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
										onChange={e => field.onChange(sanitizeName(e.target.value))}
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
					</div>
					<div>
						{isSuccess ? (
							<div className="flex flex-col items-center space-y-6">
								<div className="border-2 border-dashed border-slate-200 break-all rounded w-full p-8">
									<div className="text-sm leading-3 text-gray-600">
										Your API Key:{' '}
										<div>
											<span
												className={clsx(
													roboto.className,
													'text-base text-gray-800',
												)}
											>
												{createdApiKey?.apiKey}
											</span>
											<button
												className=" text-gray-600 focus:text-nano"
												onClick={() => copy(createdApiKey?.apiKey)}
											>
												<DocumentDuplicateIcon className="w-4 h-4 ml-2" />
											</button>
										</div>
									</div>
									<ul className="text-sm my-4 text-gray-700 list-disc">
										<li>Safely save your key.</li>
										<li>You will not be able to view this key again</li>
										<li>This key has no expiration date.</li>
										<li>Delete it or generate a new one at any time.</li>
									</ul>
								</div>
								<MButton
									onClick={() => router.push(`/services/${serviceName}/keys`)}
								>
									Done
								</MButton>
							</div>
						) : (
							<MButton
								onClick={handleSubmit(
									fields => onSubmit(fields),
									onErrorSubmiting,
								)}
								loading={isSubmitting}
								disabled={isSuccess || !watch('name')}
							>
								{isSubmitting ? 'Creating key...' : 'Create Key'}
							</MButton>
						)}
					</div>
				</div>
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
