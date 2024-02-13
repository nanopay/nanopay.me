'use client'

import Input from '@/components/Input'
import { useUser } from '@/contexts/UserProvider'
import { useToast } from '@/hooks/useToast'
import { UserEditables } from '@/types/users'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	UpdateUserProps,
	createAvatarUploadPresignedUrl,
	updateAvatar,
	updateUser,
} from './actions'
import ImageInput from '@/components/ImageInput'
import { uploadObject } from '@/services/s3'
import { Button } from '@/components/Button'

const schema: JSONSchemaType<UpdateUserProps> = {
	type: 'object',
	properties: {
		name: { type: 'string', minLength: 2, maxLength: 40 },
	},
	required: ['name'],
}

export default async function Profile() {
	const user = useUser()

	const { showError } = useToast()

	const [isPending, startTransition] = useTransition()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<UpdateUserProps>({
		defaultValues: {
			name: user.name,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = async ({ name }: Partial<UserEditables>) => {
		startTransition(async () => {
			try {
				await updateUser({ name })
			} catch (error) {
				showError(
					'Error updating user',
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
			<UserAvatar url={user.avatar_url} />

			<div className="flex w-full flex-col space-y-6">
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
			<Button
				type="submit"
				loading={isSubmitting || isPending}
				disabled={!isDirty}
			>
				Update
			</Button>
		</form>
	)
}

function UserAvatar({ url }: { url: string }) {
	const [progress, setProgress] = useState(0)
	const [isError, setIsError] = useState(false)
	const [isPending, startTransition] = useTransition()
	const { showError } = useToast()

	const handleUploadAvatar = async (file: File) => {
		startTransition(async () => {
			try {
				const url = await createAvatarUploadPresignedUrl({
					type: file.type,
					size: file.size,
				})

				await uploadObject(file, url, setProgress)
				await updateAvatar()
			} catch (error) {
				setIsError(true)
				showError(
					'Error uploading avatar',
					error instanceof Error
						? error.message
						: 'Check the data or try again later.',
				)
			}
		})
	}

	return (
		<ImageInput
			source={url}
			crop={true}
			onChange={handleUploadAvatar}
			isLoading={isPending}
			isError={isError}
			progress={progress}
		/>
	)
}
