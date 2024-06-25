'use client'

import { useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { useToast } from '@/hooks/useToast'
import { ApiKeyCreate } from '@/types/services'
import { JSONSchemaType } from 'ajv'
import { Roboto } from 'next/font/google'
import clsx from 'clsx'
import { sanitizeSlug } from '@/utils/url'
import { CopyCheckIcon, CopyIcon, InfoIcon, LockIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import Link from 'next/link'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { TextArea } from '@/components/TextArea'
import { createNewApiKey } from './actions'
import { useState, useTransition } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { API_KEY_BYTES_LENGTH } from '@/services/api-key/api-key-constants'

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
})

const schema: JSONSchemaType<Omit<ApiKeyCreate, 'service'>> = {
	type: 'object',
	properties: {
		service: { type: 'string' },
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

interface Props {
	params: {
		serviceName: string
	}
}

export default function NewApiKey({ params }: Props) {
	const { showError } = useToast()
	const [isPending, startTransition] = useTransition()
	const [apiKey, setApiKey] = useState<string | null>(null)

	const form = useForm<ApiKeyCreate>({
		defaultValues: {
			service: params.serviceName,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = async (values: ApiKeyCreate) => {
		startTransition(async () => {
			try {
				const { apiKey } = await createNewApiKey(params.serviceName, {
					name: values.name,
					description: values.description,
					scopes: ['*'],
				})
				setApiKey(apiKey)
			} catch (error) {
				showError(
					'Could not create API Key',
					error instanceof Error
						? error.message
						: 'Check your connection and try again',
				)
			}
		})
	}

	return (
		<Card className="w-full max-w-xl sm:p-6">
			<CardHeader>
				<CardTitle>New API Key</CardTitle>
				<CardDescription>
					Generate a new API key to authenticate your API requests.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="w-full space-y-6"
						onSubmit={form.handleSubmit(fields => onSubmit(fields))}
					>
						<div className="flex w-full flex-col space-y-4">
							<FormField
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel className="mb-2 flex items-center px-1 text-xs text-slate-600">
											<InfoIcon className="mr-1 w-4" />
											<p>
												Use a name like:{' '}
												<span className="font-semibold">my-token</span> or{' '}
												<span className="font-semibold">mywebsite.com</span>
											</p>
										</FormLabel>
										<FormControl>
											<Input
												label="Name"
												{...field}
												onChange={e =>
													field.onChange(sanitizeSlug(e.target.value))
												}
												invalid={fieldState.invalid}
												disabled={
													field.disabled || form.formState.isSubmitSuccessful
												}
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
												label="Description"
												{...field}
												onChange={e =>
													field.onChange(e.target.value.slice(0, 512))
												}
												invalid={fieldState.invalid}
												disabled={
													field.disabled || form.formState.isSubmitSuccessful
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex w-full justify-center">
							{!!apiKey ? (
								<ApiKeyBanner
									apiKey={apiKey}
									serviceName={params.serviceName}
								/>
							) : (
								<Button
									type="submit"
									loading={form.formState.isSubmitting || isPending}
								>
									Create Key
								</Button>
							)}
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

function ApiKeyBanner({
	apiKey,
	serviceName,
}: {
	apiKey?: string
	serviceName?: string
}) {
	const [copied, setCopied] = useState(false)

	const copy = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 3000)
	}

	return (
		<div className="flex w-full flex-col items-center gap-y-6">
			<div className="w-full rounded border-y-2 border-dashed border-slate-300 py-4 sm:border-x-2 sm:px-4">
				<div className="text-sm leading-3 text-slate-600">
					<div className="mb-2 flex items-center text-sm font-semibold">
						<LockIcon className="mr-1 h-4 w-4" /> Your API Key
					</div>
					{apiKey && (
						<div className="relative mt-2 flex w-full items-center break-all rounded-lg border border-slate-300 px-2 py-1 pr-8">
							<p className={clsx(roboto.className, 'text-base text-slate-800')}>
								<span>{apiKey.slice(0, API_KEY_BYTES_LENGTH * 2)}</span>
								<span className="font-semibold">
									{apiKey.slice(API_KEY_BYTES_LENGTH * 2)}
								</span>
							</p>
							<button
								type="button"
								className="active:text-nano group absolute right-0 top-0 flex h-full w-8 items-center justify-center rounded-r-md border-l border-slate-300 text-slate-500 hover:text-slate-700"
								onClick={() => copy(apiKey)}
								disabled={copied}
							>
								{copied ? (
									<CopyCheckIcon className="h-4 w-4 text-green-700 group-active:scale-95" />
								) : (
									<CopyIcon className="h-4 w-4 group-active:scale-95" />
								)}
							</button>
						</div>
					)}
				</div>
				<ul className="ml-6 mt-4 list-disc text-sm font-medium text-slate-700">
					<li>Safely save your key.</li>
					<li>You will not be able to view this key again</li>
					<li>This key has no expiration date.</li>
					<li>Delete it or generate a new one at any time.</li>
				</ul>
			</div>
			<Button type="button" asChild>
				<Link href={`/${serviceName}/keys`}>Done</Link>
			</Button>
		</div>
	)
}
