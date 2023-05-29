import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { fullFormats } from 'ajv-formats/dist/formats'

import { Container } from '@/components/Container'
import MButton from '@/components/MButton'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import ImageInput from '@/components/ImageInput'
import { ServiceCreate } from '@/types/services'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Header } from '@/components/Header'
import { JSONSchemaType } from 'ajv'
import { sanitizeSlug } from '@/utils/helpers'
import { useAuth } from '@/contexts/Auth'

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
		},
		description: { type: 'string', minLength: 1, maxLength: 512 },
	},
	required: ['name'],
	additionalProperties: false,
}

export default function NewService() {
	const { showError, showSuccess } = useToast()
	const router = useRouter()

	const { user } = useAuth()

	const [uploadProgress, setUploadProgress] = useState(0)

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

	const {
		mutate: uploadImage,
		isLoading: uploading,
		isError: uploadError,
	} = useMutation({
		mutationFn: (file: File) =>
			api.services.upload.avatar(file, setUploadProgress),
		onSuccess: (url: string) => {
			console.log('Url: ', url)
			setValue('avatar_url', url)
		},
		onError: (err: any) => {
			showError('Error uploading image', api.getErrorMessage(err))
		},
	})

	const {
		mutate: onSubmit,
		isLoading: isSubmitting,
		isSuccess,
	} = useMutation({
		mutationFn: async (data: ServiceCreate) => api.services.create(data),
		onSuccess: () => {
			showSuccess('Service created')
			router.push('/services/' + watch('name') + '#new')
		},
		onError: (err: any) => {
			showError('Error creating service', api.getErrorMessage(err))
		},
	})

	const onErrorSubmiting = () => {
		showError('Error creating service', 'Check the fields entered')
	}

	return (
		<>
			<Head>
				<title>New Service - NanoPay.me</title>
			</Head>
			<Header user={user} className="bg-white border-b border-slate-100" />
			<main>
				<Container className="sm:mt-24 w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 sm:rounded-lg">
					<div className="w-full flex justify-center items-center py-3 mb-8 border-b border-slate-200">
						<h3 className="text-slate-700">Create a new service</h3>
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
									<span className="font-semibold">my-service</span>
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
					<MButton
						onClick={handleSubmit(fields => onSubmit(fields), onErrorSubmiting)}
						loading={isSubmitting}
						disabled={isSuccess || uploading || !watch('name')}
					>
						{uploading
							? 'Uploading image...'
							: isSubmitting
							? 'Creating service...'
							: isSuccess
							? 'Service Created'
							: 'Create service'}
					</MButton>
				</Container>
			</main>
		</>
	)
}
