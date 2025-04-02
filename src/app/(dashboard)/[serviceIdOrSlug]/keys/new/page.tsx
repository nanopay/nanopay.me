'use client'

import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/useToast'
import {
	API_KEY_BYTES_LENGTH,
	ApiKeyCreate,
	apiKeyCreateSchema,
} from '@/core/client'
import { Roboto } from 'next/font/google'
import clsx from 'clsx'
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
import { useState, use } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
import { slugify } from '@/core/utils'

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
})

interface Props {
	params: Promise<{
		serviceIdOrSlug: string
	}>
}

export default function NewApiKey(props: Props) {
	const params = use(props.params)
	const { showError } = useToast()
	const [apiKey, setApiKey] = useState<string | null>(null)

	const form = useForm<ApiKeyCreate>({
		resolver: zodResolver(apiKeyCreateSchema),
	})

	const { executeAsync, hasSucceeded } = useAction(createNewApiKey, {
		onSuccess: ({ data }) => {
			if (!data) return
			setApiKey(data.apiKey)
		},
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Could not create API Key', message)
		},
	})

	const onSubmit = async (fields: ApiKeyCreate) => {
		await executeAsync({
			name: fields.name,
			description: fields.description,
			serviceIdOrSlug: params.serviceIdOrSlug,
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
						onSubmit={form.handleSubmit(onSubmit)}
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
												onChange={e => field.onChange(slugify(e.target.value))}
												invalid={fieldState.invalid}
												disabled={field.disabled || hasSucceeded}
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
												value={field.value ?? ''}
												onChange={e =>
													field.onChange(e.target.value.slice(0, 512))
												}
												invalid={fieldState.invalid}
												disabled={field.disabled || hasSucceeded}
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
									serviceIdOrSlug={params.serviceIdOrSlug}
								/>
							) : (
								<Button type="submit" loading={form.formState.isSubmitting}>
									Create API Key
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
	serviceIdOrSlug,
}: {
	apiKey?: string
	serviceIdOrSlug?: string
}) {
	const [copied, setCopied] = useState(false)

	const copy = (text: string) => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 3000)
	}

	return (
		<div className="flex w-full flex-col items-center gap-y-6">
			<div className="w-full rounded-sm border-y-2 border-dashed border-slate-300 py-4 sm:border-x-2 sm:px-4">
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
				<Link href={`/${serviceIdOrSlug}/keys`}>Done</Link>
			</Button>
		</div>
	)
}
