'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Button } from '@/components/Button'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { Controller, useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'

interface ResetEmailPassword {
	email: string
}

const schema: JSONSchemaType<ResetEmailPassword> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
	},
	required: ['email'],
}

export default function ForgotPasswordPage() {
	const supabase = createClientComponentClient<Database>()

	const router = useRouter()

	const { showError } = useToast()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetEmailPassword>({
		defaultValues: {
			email: '',
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const resetPassword = async ({ email }: ResetEmailPassword) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email)
		if (error) {
			showError(error.message)
		} else {
			await router.push(`/verify-email?email=${email}`)
		}
	}

	return (
		<div className="w-full flex flex-col space-y-6 px-2 sm:px-4 divide-y divide-slate-200">
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

				<Button
					color="nano"
					onClick={handleSubmit(resetPassword)}
					className="w-full"
					disabled={isSubmitting}
				>
					Reset Password
				</Button>
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
