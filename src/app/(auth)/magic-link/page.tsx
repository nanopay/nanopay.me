'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { Controller, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { useTransition } from 'react'
import { sendMagicLink } from './actions'
import { Button } from '@/components/Button'

interface MagicEmail {
	email: string
}

const schema: JSONSchemaType<MagicEmail> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
	},
	required: ['email'],
}

export default function MagicLinkPage() {
	const [isPending, startTransition] = useTransition()

	const router = useRouter()

	const { showError } = useToast()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<MagicEmail>({
		defaultValues: {
			email: '',
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = ({ email }: MagicEmail) => {
		startTransition(async () => {
			try {
				await sendMagicLink(email)
			} catch (error) {
				showError(
					'Error sending magic link',
					error instanceof Error
						? error.message
						: 'Check the email or try again later.',
				)
			}
		})
	}

	return (
		<div className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4">
			<form className="w-full py-6" onSubmit={handleSubmit(onSubmit)}>
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

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					Send Magic Link
				</Button>
			</form>
			<div className="flex flex-col items-center py-6">
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
