'use client'

import Input from '@/components/Input'
import MButton from '@/components/MButton'
import { useUser } from '@/contexts/UserProvider'
import { useToast } from '@/hooks/useToast'
import { UserEditables } from '@/types/users'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import Image from 'next/image'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { updateUser } from './actions'

const schema: JSONSchemaType<UserEditables> = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
	},
	required: ['name', 'avatar_url'],
}

export default async function Profile() {
	const user = useUser()

	const { showError } = useToast()

	const [isPending, startTransition] = useTransition()

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<UserEditables>({
		defaultValues: {
			name: user.name,
			avatar_url: user.avatar_url,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = async ({ name, avatar_url }: UserEditables) => {
		startTransition(async () => {
			try {
				await updateUser({ name, avatar_url })
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

				<Input
					label="E-mail"
					value={user.email}
					errorMessage={!user.email ? 'Missing user email' : undefined}
					className="w-full"
					InputLabelProps={{
						shrink: true,
					}}
					disabled
				/>
			</div>
			<MButton
				type="submit"
				loading={isSubmitting || isPending}
				disabled={!isDirty}
			>
				Update
			</MButton>
		</form>
	)
}
