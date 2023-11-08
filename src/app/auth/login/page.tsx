'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { getURL } from '@/utils/helpers'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Image from 'next/image'
import GithubSVG from '@/images/logos/github.svg'
import { Button } from '@/components/Button'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { Controller, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'
import MailSentSvg from '@/images/mail-sent.svg'

interface AuthEmailPassword {
	email: string
	password: string
}

const schema: JSONSchemaType<AuthEmailPassword> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
		password: { type: 'string', minLength: 8, maxLength: 64 },
	},
	required: ['email', 'password'],
}

export default function LoginPage() {
	const [verificationIsPending, setVerificationIsPending] = useState(false)

	const supabase = createBrowserSupabaseClient<Database>()

	const redirectedFrom = useSearchParams()?.get('redirectedFrom')

	const redirectTo = `${getURL()}redirect?to=${encodeURI(
		typeof redirectedFrom === 'string' ? redirectedFrom : '/home',
	)}`

	const { showError, showSuccess } = useToast()

	const router = useRouter()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AuthEmailPassword>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const signWithGithub = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo,
			},
		})
	}

	const signWithPassword = async ({ email, password }: AuthEmailPassword) => {
		const { error, data } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			console.log(
				error.cause,
				error.name,
				error.stack,
				error.status,
				error.message,
			)
			if (error.message === 'Email not confirmed') {
				setVerificationIsPending(true)
			} else {
				showError(error.message)
			}
		} else {
			await router.push('/home')
		}
	}

	if (verificationIsPending) {
		return (
			<div className="w-full flex flex-col px-2 sm:px-4 divide-y divide-slate-200">
				<div className="py-6 w-full border-t border-slate-200">
					<h1 className="text-2xl font-semibold text-slate-900">
						Verify your Email
					</h1>
					<p className="text-base font-medium text-slate-600">
						We sent you an email with a magic link to sign in.
					</p>
					<div className="w-full flex justify-center">
						<Image
							width={250}
							height={250}
							src={MailSentSvg}
							alt="email sent art"
						/>
					</div>
				</div>
				<div className="py-6 flex flex-col items-center">
					<h2 className="text-base font-semibold text-slate-600">
						Back to{' '}
						<Link href="/login" className="text-nano underline">
							Login
						</Link>
					</h2>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col space-y-6 px-2 sm:px-4 divide-y divide-slate-200">
			<Button color="slate" onClick={signWithGithub} variant="outline">
				<div className="flex items-center space-x-2">
					<Image src={GithubSVG} width={20} height={20} alt="github icon" />
					<span>Sign in with Github</span>
				</div>
			</Button>
			<div className="py-6 w-full">
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<Input
							label="E-mail"
							{...field}
							errorMessage={errors.email?.message}
							className="w-full !bg-transparent"
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<Input
							label="Password"
							type="password"
							{...field}
							onChange={e => field.onChange(e.target.value.slice(0, 40))}
							errorMessage={errors.password?.message}
							className="w-full !bg-transparent"
						/>
					)}
				/>

				<Button
					color="nano"
					onClick={handleSubmit(signWithPassword)}
					className="w-full"
					disabled={isSubmitting}
				>
					Sign In
				</Button>
				<div className="pt-6 flex flex-col items-center">
					<Link href="" className="text-sm text-nano hover:underline">
						Send a magic link email
					</Link>
					<Link href="" className="text-sm text-nano hover:underline">
						Forgot your password ?
					</Link>
				</div>
			</div>
			<div className="py-6 flex flex-col items-center">
				<h2 className="text-base font-semibold text-slate-600">
					Don't have an account ?{' '}
					<Link href="/signup" className="text-nano underline">
						Sign Up
					</Link>
				</h2>
			</div>
		</div>
	)
}
