'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { getURL } from '@/utils/helpers'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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

interface SignUpEmailPassword {
	email: string
	password: string
}

const schema: JSONSchemaType<SignUpEmailPassword> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
		password: { type: 'string', minLength: 8, maxLength: 64 },
	},
	required: ['email', 'password'],
}

export default function SignUpPage() {
	const supabase = createClientComponentClient<Database>()

	const redirectedFrom = useSearchParams()?.get('redirectedFrom')

	const redirectTo = `${getURL()}redirect?to=${encodeURI(
		typeof redirectedFrom === 'string' ? redirectedFrom : '/home',
	)}`

	const router = useRouter()

	const { showError } = useToast()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpEmailPassword>({
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

	const signUpWithPassword = async ({
		email,
		password,
	}: SignUpEmailPassword) => {
		const { error, data } = await supabase.auth.signUp({
			email,
			password,
		})
		if (error) {
			showError(error.message)
		} else {
			await router.push(`/verify-email?email=${email}`)
		}
	}

	return (
		<div className="w-full flex flex-col space-y-6 px-2 sm:px-4 divide-y divide-slate-200">
			<Button color="slate" onClick={signWithGithub} variant="outline">
				<div className="flex items-center space-x-2">
					<Image src={GithubSVG} width={20} height={20} alt="github icon" />
					<span>Sign up with Github</span>
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
					onClick={handleSubmit(signUpWithPassword)}
					className="w-full"
					disabled={isSubmitting}
				>
					Sign Up
				</Button>
			</div>
			<div className="py-6 flex flex-col items-center">
				<h2 className="text-base font-semibold text-slate-600">
					Already have an account ?{' '}
					<Link href="/login" className="text-nano underline">
						Sign In
					</Link>
				</h2>
			</div>
		</div>
	)
}
