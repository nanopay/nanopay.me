'use client'

import { useToast } from '@/hooks/useToast'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import Input from '@/components/Input'
import { useState, useTransition } from 'react'
import { JSONSchemaType } from 'ajv'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { UserEditables } from '@/types/users'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { createUserProfile } from './actions'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import Link from 'next/link'

const schema: JSONSchemaType<UserEditables> = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
	},
	required: ['name', 'avatar_url'],
}

export interface CompleteProfileFormProps {
	initialData: {
		email: string
		name?: string
		avatar_url?: string
	}
}

export default function CompleteProfileForm({
	initialData,
}: CompleteProfileFormProps) {
	const [isPending, startTransition] = useTransition()

	const { showError } = useToast()

	const [acceptTerms, setAcceptTerms] = useState(false)

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<UserEditables>({
		defaultValues: {
			name: initialData.name,
			avatar_url: initialData.avatar_url || DEFAULT_AVATAR_URL,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const handleAcceptTerms = (checked: CheckedState) => {
		setAcceptTerms(checked === true)
	}

	const onSubmit = async ({ name, avatar_url }: UserEditables) => {
		startTransition(async () => {
			try {
				await createUserProfile({ name, avatar_url })
			} catch (error) {
				showError(
					'Error creating user profile',
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
			className="flex w-full max-w-sm flex-col items-center space-y-6"
		>
			<Image
				src={getValues('avatar_url') || ''}
				alt="Logo"
				width={128}
				height={128}
				className="rounded-full border-2 border-slate-200"
				priority
			/>

			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<Input
						label="Name *"
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

			<Input
				label="E-mail"
				value={initialData.email}
				errorMessage={!initialData ? 'Missing email' : undefined}
				className="w-full"
				InputLabelProps={{
					shrink: true,
				}}
				disabled
			/>
			<div className="flex select-none items-center gap-2">
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
				loading={isSubmitting || isPending}
				disabled={
					!getValues('name') ||
					!initialData.email ||
					!getValues('avatar_url') ||
					!acceptTerms
				}
			>
				Register Me
			</Button>
		</form>
	)
}
