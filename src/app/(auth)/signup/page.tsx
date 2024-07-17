'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import GithubSVG from '@/images/logos/github.svg'
import { Button } from '@/components/Button'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { signWithGithub } from '../login/actions'
import { signUpWithPassword } from './actions'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { signWithEmailAndPasswordSchema } from '@/core/client/auth/auth-schemas'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { CheckedState } from '@radix-ui/react-checkbox'

interface SignUpEmailPassword {
	email: string
	password: string
}

export default function SignUpPage() {
	const next = useSearchParams().get('next') || undefined

	const { showError } = useToast()
	const [acceptTerms, setAcceptTerms] = useState(false)

	const form = useForm<SignUpEmailPassword>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(signWithEmailAndPasswordSchema),
	})

	const { executeAsync: onSubmit } = useAction(signUpWithPassword, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError(message)
		},
	})

	const handleAcceptTerms = (checked: CheckedState) => {
		setAcceptTerms(checked === true)
	}

	return (
		<Form {...form}>
			<form
				className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Button
					color="slate"
					type="button"
					onClick={() => signWithGithub({ next })}
					variant="outline"
				>
					<div className="flex items-center space-x-2">
						<Image src={GithubSVG} width={20} height={20} alt="github icon" />
						<span>Sign up with Github</span>
					</div>
				</Button>
				<div className="w-full space-y-4 py-6">
					<FormField
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="E-mail"
										{...field}
										invalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="password"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Password"
										type="password"
										{...field}
										onChange={e => field.onChange(e.target.value.slice(0, 40))}
										invalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex select-none items-center gap-2 p-2">
						<Checkbox
							id="terms"
							checked={acceptTerms}
							onCheckedChange={handleAcceptTerms}
						/>
						<label
							htmlFor="terms"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							I agree to the{' '}
							<Link href="/terms" target="_blank" className="text-nano">
								terms of service
							</Link>
						</label>
					</div>

					<Button
						type="submit"
						className="w-full"
						loading={form.formState.isSubmitting}
						disabled={!form.formState.isDirty || !acceptTerms}
					>
						Sign Up
					</Button>
				</div>
				<div className="flex flex-col items-center py-6">
					<h2 className="text-base font-semibold text-slate-600">
						Already have an account ?{' '}
						<Link href="/login" className="text-nano underline">
							Sign In
						</Link>
					</h2>
				</div>
			</form>
		</Form>
	)
}
