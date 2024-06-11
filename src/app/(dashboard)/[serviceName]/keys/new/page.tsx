'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { ApiKeyCreate } from '@/types/services'
import { JSONSchemaType } from 'ajv'
import { Roboto } from 'next/font/google'
import clsx from 'clsx'
import { sanitizeSlug } from '@/utils/url'
import { Container } from '@/components/Container'
import { CopyIcon, InfoIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import Link from 'next/link'

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
			api.services.apiKeys.create(serviceName, {
				...data,
				service: serviceName,
			}),
		onSuccess: () => {
			showSuccess('API Key created')
		},
		onError: (err: any) => {
			showError(
				'Error creating service',
				api.getErrorMessage(err) || 'Try again later',
			)
		},
	})

	if (!serviceName) {
		return null
	}

	const onErrorSubmiting = () => {
		showError('Error creating service', 'Check the fields entered')
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
			<Container className="flex h-screen w-full max-w-xl flex-col items-center space-y-6 border border-slate-200 bg-white px-16 pb-16 sm:h-auto sm:rounded-lg">
				<div className="mb-8 flex w-full items-center justify-center space-x-2 border-b border-slate-200 py-3">
					<h3 className="text-lg font-semibold text-slate-700">
						Create a new key
					</h3>
				</div>

				<div className="flex w-full flex-col space-y-6 px-4 py-4 sm:px-8">
					<div>
						<div className="mb-2 flex items-center text-xs text-slate-600">
							<InfoIcon className="mr-1 w-4" />
							<div>
								Use a name like: <span className="font-semibold">my-token</span>
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
				</div>
				<div>
					{isSuccess ? (
						<div className="flex flex-col items-center space-y-6">
							<div className="w-full break-all rounded border-2 border-dashed border-slate-200 p-8">
								<div className="text-sm leading-3 text-slate-600">
									Your API Key:{' '}
									<div>
										<span
											className={clsx(
												roboto.className,
												'text-base text-slate-800',
											)}
										>
											{createdApiKey?.apiKey}
										</span>
										<button
											className=" focus:text-nano text-slate-600"
											onClick={() => copy(createdApiKey?.apiKey)}
										>
											<CopyIcon className="ml-2 h-4 w-4" />
										</button>
									</div>
								</div>
								<ul className="my-4 list-disc text-sm text-slate-700">
									<li>Safely save your key.</li>
									<li>You will not be able to view this key again</li>
									<li>This key has no expiration date.</li>
									<li>Delete it or generate a new one at any time.</li>
								</ul>
							</div>
							<Button asChild>
								<Link href={`/${serviceName}/keys`}>Done</Link>
							</Button>
						</div>
					) : (
						<Button
							onClick={handleSubmit(
								fields => onSubmit(fields),
								onErrorSubmiting,
							)}
							loading={isSubmitting}
							disabled={isSuccess || !watch('name')}
						>
							Create Key
						</Button>
					)}
				</div>
			</Container>
		</>
	)
}
