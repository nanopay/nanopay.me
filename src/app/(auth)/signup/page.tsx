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
import { useToast } from '@/hooks/useToast'
import { signWithGithub } from '../login/actions'
import { useTransition } from 'react'
import { signUpWithPassword } from './actions'

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
	const [isPending, startTransition] = useTransition()

	const next = useSearchParams().get('next') || undefined

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

	const onSubmit = ({ email, password }: SignUpEmailPassword) => {
		startTransition(async () => {
			try {
				await signUpWithPassword({ email, password })
			} catch (error) {
				showError(
					'Error signing up',
					error instanceof Error
						? error.message
						: 'Check the data or try again later.',
				)
			}
		})
	}

	return (
		<form
			className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4"
			onSubmit={handleSubmit(onSubmit)}
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
					type="submit"
					className="w-full"
					loading={isSubmitting || isPending}
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
	)
}
