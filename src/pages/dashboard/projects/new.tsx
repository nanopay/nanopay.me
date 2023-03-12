import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'

import { Container } from '@/components/Container'
import MButton from '@/components/MButton'
import Input from '@/components/Input'
import { Logomark } from '@/components/Logo'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import ImageInput from '@/components/ImageInput'
import { ProjectCreate } from '@/types/projects'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

const schema = {
	type: 'object',
	properties: {
		name: {
			type: 'string',
			minLength: 2,
			maxLength: 40,
			pattern: '^[a-zA-Z0-9-.]+$',
		},
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
		description: { type: 'string', maxLength: 512 },
	},
	required: ['name', 'avatar_url'],
}

export default function NewProject() {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const [uploadProgress, setUploadProgress] = useState(0)

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ProjectCreate>({
		defaultValues: {
			avatar_url: `https://${process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST}/images/placeholder.png`,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const {
		mutate: uploadImage,
		isLoading: uploading,
		isError: uploadError,
	} = useMutation({
		mutationFn: (file: File) =>
			api.users.upload.avatar(file, setUploadProgress),
		onSuccess: (url: string) => {
			console.log('Url: ', url)
			setValue('avatar_url', url)
		},
		onError: (err: any) => {
			showError('Error uploading image', err.message)
		},
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
	} = useMutation({
		mutationFn: async (data: ProjectCreate) => api.projects.create(data),
		onSuccess: () => {
			showSuccess('Project created')
			router.push('/dashboard')
		},
		onError: (err: any) => {
			showError('Error creating project', err.message)
		},
	})

	const onErrorSubmiting = () => {
		showError('Error creating project', 'Check the fields entered')
	}

	const sanitizeProjectName = (name: string) => {
		// only allows lowercase letters, numbers, dashes, underscores and dots
		return name.slice(0, 40).replace(/[^a-z0-9-_\.]/g, '')
	}

	return (
		<>
			<Head>
				<title>Dashboard - NanoPay.me</title>
			</Head>
			<main>
				<Container className="sm:mt-24 w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 rounded-lg">
					<div className="w-full flex space-x-2 justify-between items-center py-3 mb-8 border-b border-slate-200">
						<Logomark className="w-6" />
						<h3 className="text-slate-700">Create a new project</h3>
						<div />
					</div>

					<ImageInput
						source={watch('avatar_url')}
						crop={true}
						onChange={uploadImage}
						isLoading={uploading}
						isError={uploadError}
						progress={uploadProgress}
					/>

					<div className="w-full flex flex-col space-y-6 px-4 sm:px-8 py-6">
						<div>
							<div className="flex mb-2 items-center text-xs text-gray-600">
								<InformationCircleIcon className="w-4 mr-1" />
								<div>
									Use a name like:{' '}
									<span className="font-semibold">my-project</span>
									{' or '}
									<span className="font-semibold">myproject2.com</span>
								</div>
							</div>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<Input
										label="Name"
										{...field}
										onChange={e =>
											field.onChange(sanitizeProjectName(e.target.value))
										}
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
					<MButton
						onClick={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
						loading={isSubmitting}
						disabled={
							isSuccess || uploading || !watch('name') || !watch('avatar_url')
						}
					>
						{uploading
							? 'Uploading image...'
							: isSubmitting
							? 'Creating project...'
							: isSuccess
							? 'Project Created'
							: 'Create project'}
					</MButton>
				</Container>
			</main>
		</>
	)
}
