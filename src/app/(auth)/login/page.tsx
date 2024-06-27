'use client'

import Link from 'next/link'
import Image from 'next/image'
import GithubSVG from '@/images/logos/github.svg'
import { Button } from '@/components/Button'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { signWithGithub, signWithPassword } from './actions'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { useAction } from '@/hooks/useAction'
import { useToast } from '@/hooks/useToast'
import { zodResolver } from '@hookform/resolvers/zod'
import { signWithEmailAndPasswordSchema } from '@/services/client/auth/auth-schemas'

interface AuthEmailPassword {
	email: string
	password: string
}

interface Props {
	searchParams: {
		next?: string
	}
}

export default function LoginPage({ searchParams: { next } }: Props) {
	const { showError } = useToast()

	const form = useForm<AuthEmailPassword>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(signWithEmailAndPasswordSchema),
	})

	const { execute: handleSignWithPassword } = useAction(
		async (data: AuthEmailPassword) => {
			return await signWithPassword({ ...data, next })
		},
		{
			onError: error => {
				showError(error.message)
			},
		},
	)

	return (
		<Form {...form}>
			<form
				className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4"
				onSubmit={form.handleSubmit(handleSignWithPassword)}
			>
				<Button
					color="slate"
					type="button"
					onClick={() => signWithGithub({ next })}
					variant="outline"
				>
					<div className="flex items-center space-x-2">
						<Image src={GithubSVG} width={20} height={20} alt="github icon" />
						<span>Sign in with Github</span>
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
										invalid={fieldState.invalid}
										{...field}
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
										invalid={fieldState.invalid}
										{...field}
										onChange={e => field.onChange(e.target.value.slice(0, 40))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						color="nano"
						formAction="sign-with-password"
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
						loading={form.formState.isSubmitting}
					>
						Sign In
					</Button>
					<div className="flex flex-col items-center pt-6">
						<Link
							href="/magic-link"
							className="text-nano text-sm hover:underline"
						>
							Send a magic link email
						</Link>
						<Link
							href="/forgot-password"
							className="text-nano text-sm hover:underline"
						>
							Forgot your password ?
						</Link>
					</div>
				</div>
				<div className="flex flex-col items-center py-6">
					<h2 className="text-base font-semibold text-slate-600">
						Don&apos;t have an account ?{' '}
						<Link href="/signup" className="text-nano underline">
							Sign Up
						</Link>
					</h2>
				</div>
			</form>
		</Form>
	)
}
