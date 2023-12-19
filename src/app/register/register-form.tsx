'use client'

import { useToast } from '@/hooks/useToast'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import Input from '@/components/Input'
import MButton from '@/components/MButton'
import { Checkbox } from '@mui/material'
import { useState, useTransition } from 'react'
import { JSONSchemaType } from 'ajv'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { UserProfile } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { registerUser } from './actions'

const schema: JSONSchemaType<UserProfile> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
	},
	required: ['email', 'name', 'avatar_url'],
}

export interface RegisterFormProps {
	initialData: {
		email: string
		name?: string
		avatar_url?: string
	}
}

export default function RegisterForm({ initialData }: RegisterFormProps) {
	const [isPending, startTransition] = useTransition()

	const { showError } = useToast()

	const [acceptTerms, setAcceptTerms] = useState(false)

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<UserProfile>({
		defaultValues: {
			name: initialData.name,
			email: initialData.email,
			avatar_url: initialData.avatar_url || DEFAULT_AVATAR_URL,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const handleAcceptTerms = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAcceptTerms(event.target.checked)
	}

	const onSubmit = async ({ name, email, avatar_url }: UserProfile) => {
		startTransition(async () => {
			try {
				await registerUser({ name, avatar_url })
			} catch (error) {
				showError(
					'Error registering user',
					error instanceof Error
						? error.message
						: 'Check the data or try again later.',
				)
			}
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="w-full max-w-sm flex flex-col items-center space-y-6"
		>
			<Image
				src={getValues('avatar_url') || ''}
				alt="Logo"
				width={128}
				height={128}
				className="mb-4 rounded-full border-2 border-slate-200"
				priority
			/>
			<div className="w-full flex flex-col space-y-6">
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<Input
							label="Name"
							{...field}
							onChange={e => field.onChange(e.target.value.slice(0, 40))}
							errorMessage={errors.name?.message}
							className="w-full"
							autoCapitalize="words"
							style={{
								textTransform: 'capitalize',
							}}
						/>
					)}
				/>

				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<Input
							label="E-mail"
							{...field}
							errorMessage={errors.email?.message}
							className="w-full"
							InputLabelProps={{
								shrink: true,
							}}
							disabled
						/>
					)}
				/>
			</div>
			<div className="flex items-center">
				<Checkbox checked={acceptTerms} onChange={handleAcceptTerms} />
				<div>
					I agree to the{' '}
					<a href="/terms" target="_blank" className="text-nano">
						terms of service
					</a>
				</div>
			</div>
			<MButton
				type="submit"
				loading={isSubmitting || isPending}
				disabled={
					!getValues('name') ||
					!getValues('email') ||
					!getValues('avatar_url') ||
					!acceptTerms
				}
			>
				Register Me
			</MButton>
		</form>
	)
}
