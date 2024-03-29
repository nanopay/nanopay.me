'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import GithubSVG from '@/images/logos/github.svg'
import { Button } from '@/components/Button'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { Controller, useForm } from 'react-hook-form'
import { signWithGithub, signWithPassword } from './actions'

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
	const next = useSearchParams().get('next') || undefined

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

	return (
		<form
			className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4"
			onSubmit={handleSubmit(data => signWithPassword({ ...data, next }))}
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
			<div className="w-full py-6">
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
					formAction="sign-with-password"
					type="submit"
					className="w-full"
					disabled={isSubmitting}
				>
					Sign In
				</Button>
				<div className="flex flex-col items-center pt-6">
					<Link
						href="/magic-link"
						className="text-sm text-nano hover:underline"
					>
						Send a magic link email
					</Link>
					<Link
						href="/forgot-password"
						className="text-sm text-nano hover:underline"
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
	)
}
