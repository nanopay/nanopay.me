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
import { ApiKeyCreate } from '@/types/projects'
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

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
})

const schema: JSONSchemaType<Omit<ApiKeyCreate, 'project'>> = {
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

export default function NewProject({ user }: { user: UserProfile }) {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const projectName = router.query.projectName as string

	const { data: project, isLoading } = useQuery({
		queryKey: ['project', projectName],
		queryFn: () => api.projects.get(projectName).then(res => res.data),
	})

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
			api.projects.apiKeys
				.create(projectName, {
					...data,
					project: projectName,
				})
				.then(res => res.data),
		onSuccess: () => {
			showSuccess('API Key created')
		},
		onError: (err: any) => {
			showError('Error creating project', api.getErrorMessage(err))
		},
	})

	if (!projectName) {
		return null
	}

	const onErrorSubmiting = () => {
		showError('Error creating project', 'Check the fields entered')
	}

	const sanitizeProjectName = (name: string) => {
		// only allows lowercase letters, numbers, dashes, underscores and dots
		return name.slice(0, 40).replace(/[^a-z0-9-_\.]/g, '')
	}

	if (!isLoading && !project) {
		return (
			<>
				<Head>
					<title>API Keys - NanoPay.me</title>
				</Head>
				<Header user={user} className="bg-white border-b border-slate-100" />
				<Container>
					<div>Something went wrong!</div>
				</Container>
			</>
		)
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
				<title>API Keys - NanoPay.me</title>
			</Head>
			<Header user={user} className="bg-white border-b border-slate-100" />
			<main>
				<Container className="sm:mt-24 w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 sm:rounded-lg">
					<div className="w-full flex justify-center items-center space-x-2 py-3 mb-8 border-b border-slate-200">
						<div className="flex space-x-2 items-center">
							{isLoading ? (
								<div className="animate-pulse w-8 h-8 bg-slate-200 rounded-full" />
							) : (
								<>
									<Image
										src={project.avatar_url}
										width={32}
										height={32}
										alt="project logo"
									/>
									<h3 className="text-slate-700">{project.name}</h3>
								</>
							)}
						</div>
						<ChevronRightIcon className="w-4 h-4 text-slate-400" />
						<h3 className="text-slate-700">Create a new key</h3>
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
										onChange={e =>
											field.onChange(sanitizeProjectName(e.target.value))
										}
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
									onClick={() => router.push(`/projects/${projectName}/keys`)}
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
				</Container>
			</main>
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
