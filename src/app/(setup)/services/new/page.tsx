'use client'

import { useState, useTransition } from 'react'
import { Controller, FieldErrors, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import ImageInput from '@/components/ImageInput'
import { ServiceCreate } from '@/types/services'
import { JSONSchemaType } from 'ajv'
import { sanitizeSlug } from '@/utils/url'
import { createAvatarUploadPresignedUrl, createService } from './actions'
import { uploadObject } from '@/services/s3'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/Button'

const schema: JSONSchemaType<ServiceCreate> = {
	type: 'object',
	properties: {
		name: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
			pattern: '^[a-zA-Z0-9-.]+$',
		},
		avatar_url: {
			type: 'string',
			format: 'url',
			minLength: 12,
			maxLength: 256,
			nullable: true,
		},
		description: {
			type: 'string',
			minLength: 1,
			maxLength: 512,
			nullable: true,
		},
	},
	required: ['name'],
	additionalProperties: false,
}

export default function NewService() {
	const { showError } = useToast()

	const [isUploading, setIsUploading] = useState(false)

	const [isPending, startTransition] = useTransition()

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ServiceCreate>({
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = async (data: ServiceCreate) => {
		startTransition(async () => {
			try {
				await createService(data)
			} catch (error) {
				showError(
					'Error creating service',
					api.getErrorMessage(error) || 'Try again Later',
				)
			}
		})
	}

	const onErrorSubmiting = (e: FieldErrors<ServiceCreate>) => {
		showError(
			'Error creating service',
			e.avatar_url
				? `avatar_url ${e.avatar_url.message}`
				: 'Check the fields entered',
		)
	}

	return (
		<Container className="flex h-screen w-full max-w-xl flex-col items-center space-y-6 border border-slate-200 bg-white px-16 pb-16 sm:h-auto sm:rounded-lg">
			<div className="mb-8 flex w-full items-center justify-center border-b border-slate-200 py-3">
				<h3 className="text-slate-700">Create a new service</h3>
			</div>

			<ServiceAvatar
				url={watch('avatar_url') || undefined}
				onChange={url => {
					console.log('new url', url)
					setValue('avatar_url', url)
				}}
				onUploading={setIsUploading}
			/>

			<div className="flex w-full flex-col space-y-6 px-4 py-6 sm:px-8">
				<div>
					<div className="mb-2 flex items-center text-xs text-slate-600">
						<InfoIcon className="mr-1 w-4" />
						<div>
							Use a name like: <span className="font-semibold">my-service</span>
							{' or '}
							<span className="font-semibold">myservice2.com</span>
						</div>
					</div>
					<Controller
						name="name"
						control={control}
						render={({ field }) => (
							<Input
								label="Name"
								{...field}
								onChange={e => field.onChange(sanitizeSlug(e.target.value))}
								errorMessage={errors.name?.message}
								className="w-full"
								autoCapitalize="words"
								style={{
									textTransform: 'capitalize',
								}}
							/>
						)}
					/>
				</div>

				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<Input
							label="Description"
							{...field}
							onChange={e => field.onChange(e.target.value.slice(0, 512))}
							errorMessage={errors.description?.message}
							className="w-full"
							multiline={true}
						/>
					)}
				/>
			</div>
			<div />
			<Button
				onClick={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
				loading={isPending}
				disabled={isUploading || !watch('name')}
			>
				Create Service
			</Button>
		</Container>
	)
}

function ServiceAvatar({
	url,
	onChange,
	onUploading,
}: {
	url?: string
	onChange: (url: string) => void
	onUploading: (bool: boolean) => void
}) {
	const [progress, setProgress] = useState(0)
	const [isError, setIsError] = useState(false)
	const [isPending, startTransition] = useTransition()
	const { showError } = useToast()

	const handleUploadAvatar = async (file: File) => {
		startTransition(async () => {
			try {
				onUploading(true)

				const { uploadUrl, getUrl } = await createAvatarUploadPresignedUrl({
					type: file.type,
					size: file.size,
				})

				await uploadObject(file, uploadUrl, setProgress)
				onChange(getUrl)
			} catch (error) {
				setIsError(true)
				showError(
					'Error uploading avatar',
					error instanceof Error
						? error.message
						: 'Check the data or try again later.',
				)
			} finally {
				onUploading(false)
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
