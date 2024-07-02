'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { useRef } from 'react'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { VerifyOtp, verifyOtpSchema } from '@/services/client'
import { verifySignUp } from './actions'

interface Props {
	searchParams: {
		email: string
		next?: string
	}
}

export default function ConfirmSignUp({
	searchParams: { email, next },
}: Props) {
	const buttonRef = useRef<HTMLButtonElement>(null)

	const { showError } = useToast()

	const form = useForm<VerifyOtp>({
		defaultValues: {
			email,
			token: '',
		},
		resolver: zodResolver(verifyOtpSchema),
	})

	const { executeAsync } = useAction(verifySignUp, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			if (message === 'Token has expired or is invalid') {
				form.setError(
					'token',
					{
						message: 'The code entered is invalid or has expired.',
					},
					{ shouldFocus: true },
				)
				return
			}
			showError('Error verifying code', message)
		},
	})

	const onSubmit = async (data: VerifyOtp) => {
		await executeAsync({
			...data,
			next,
		})
	}

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	if (!isValidEmail(email)) {
		return (
			<div className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4">
				<div className="flex flex-col items-center py-6">
					<h2 className="text-base font-semibold text-slate-600">
						Email inválido
					</h2>
				</div>
			</div>
		)
	}

	return (
		<Card className="border-0 shadow-none">
			<CardHeader>
				<CardTitle>Confirm your email</CardTitle>
				<CardDescription>
					Enter the 6-digit code sent to the email <b>{email}</b>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4">
					<Form {...form}>
						<form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
							<div className="mb-8 flex w-full flex-col items-center">
								<FormField
									name="token"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<InputOTP
													maxLength={6}
													pattern={REGEXP_ONLY_DIGITS}
													{...field}
												>
													<InputOTPGroup>
														<InputOTPSlot index={0} />
														<InputOTPSlot index={1} />
														<InputOTPSlot index={2} />
														<InputOTPSlot index={3} />
														<InputOTPSlot index={4} />
														<InputOTPSlot index={5} />
													</InputOTPGroup>
												</InputOTP>
											</FormControl>
											<FormMessage className="pb-4" />
										</FormItem>
									)}
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								loading={form.formState.isSubmitting}
								ref={buttonRef}
							>
								Confirm
							</Button>
						</form>
					</Form>
					<div className="flex flex-col items-center py-6">
						<h2 className="text-base font-semibold text-slate-600">
							Back to{' '}
							<Link href="/login" className="text-nano underline">
								Login
							</Link>
						</h2>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
