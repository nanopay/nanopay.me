'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { createSponsor } from '../actions'
import { useToast } from '@/hooks/useToast'
import { getSafeActionError } from '@/lib/safe-action'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { SponsorCreate } from '@/core/client/sponsors/sponsors-types'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { DONATE_URL, MIN_SPONSOR_AMOUNT } from '@/core/constants'
import ImageInput from '@/components/ImageInput'
import { useUploader } from '@/hooks/useUploader'
import { cn } from '@/lib/cn'

const amountSuggestions = [
	{
		label: '10 NANO',
		value: 5,
	},
	{
		label: '20 NANO',
		value: 20,
	},
	{
		label: '50 NANO',
		value: 50,
	},
	{
		label: '100 NANO',
		value: 100,
	},
	{
		label: '200 NANO',
		value: 200,
	},
	{
		label: '500 NANO',
		value: 500,
	},
]

export function SponsorCard({ ...props }: React.ComponentProps<typeof Card>) {
	const [showCustomAmountInput, setShowCustomAmountInput] = useState(false)

	const form = useForm<SponsorCreate>({
		defaultValues: {
			name: 'Anonymous',
			avatar_url: null,
			message: '',
			amount: 50,
		},
	})

	const { showError } = useToast()

	const { executeAsync: create, isExecuting: isCreating } = useAction(
		createSponsor,
		{
			onError: ({ error }) => {
				const { message } = getSafeActionError(error)
				showError(message)
			},
		},
	)

	const onSubmit = ({ name, avatar_url, message, amount }: SponsorCreate) => {
		create({
			name,
			avatar_url,
			message,
			amount,
		})
	}

	const isAmountSponsored = form.watch('amount') >= MIN_SPONSOR_AMOUNT

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-[500px]"
			>
				<Card {...props} className={cn('h-fit w-full', props.className)}>
					<CardHeader>
						<CardTitle>Sponsor NanoPay</CardTitle>
						<CardDescription>
							Support our project by becoming a sponsor
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<FormField
								name="amount"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Donation Amount (NANO)</FormLabel>
										<FormControl>
											{showCustomAmountInput ? (
												<Input
													label="Custom Amount"
													type="number"
													{...field}
													onChange={e => field.onChange(e.target.valueAsNumber)}
												/>
											) : (
												<Select
													{...field}
													value={field.value.toString()}
													onValueChange={val => field.onChange(Number(val))}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select amount" />
													</SelectTrigger>
													<SelectContent>
														{amountSuggestions.map(amount => (
															<SelectItem
																key={amount.value}
																value={amount.value.toString()}
																className="focus:bg-primary/20 focus:text-primary font-semibold text-slate-700"
															>
																{amount.label}
															</SelectItem>
														))}
														<Button
															value="1000"
															onClick={() => setShowCustomAmountInput(true)}
															variant="ghost"
															className="w-full justify-start pl-8 font-semibold text-slate-700"
														>
															Custom Amount
														</Button>
													</SelectContent>
												</Select>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{isAmountSponsored && (
								<>
									<div className="flex items-center space-x-4">
										<FormField
											name="avatar_url"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<SponsorAvatar
															src={field.value}
															onChange={value => {
																field.onChange(value)
																form.clearErrors('avatar_url')
															}}
															onError={message => {
																form.setError('avatar_url', { message })
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											name="name"
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															label="Name"
															placeholder="Your name"
															required
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										name="message"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Message (optional)</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Your message of support"
														{...field}
														value={field.value ?? ''}
														className="min-h-[100px]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							{!isAmountSponsored && (
								<>
									<p className="text-sm text-slate-500">
										Donate at least <b>{MIN_SPONSOR_AMOUNT} NANO</b> to be
										listed as a sponsor.
									</p>
									<p className="text-sm text-slate-500">
										For smaller amounts you can make a{' '}
										<Link
											href={DONATE_URL}
											target="_blank"
											className="hover:text-primary font-semibold underline"
										>
											donation
										</Link>{' '}
										instead.
									</p>
								</>
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full bg-gradient-to-br from-[#4A90E2] to-pink-400/60 font-bold hover:bg-[#357ABD]"
							loading={isCreating}
							disabled={form.getValues('amount') < MIN_SPONSOR_AMOUNT}
						>
							Ӿ Sponsor
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}

function SponsorAvatar({
	src,
	onChange,
	onError,
}: {
	src?: string | null
	onChange: (url: string) => void
	onError?: (message: string) => void
}) {
	const { upload, isUploading, progress, isError } = useUploader(
		`/sponsors/avatar`,
		{
			onSuccess: onChange,
			onError: onError,
		},
	)

	return (
		<ImageInput
			src={src}
			crop={true}
			onChange={upload}
			isLoading={isUploading}
			isError={isError}
			progress={progress}
			width={56}
			height={56}
			alt={'Avatar'}
		/>
	)
}
