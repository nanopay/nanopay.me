'use client'

import { Container } from '@/components/Container'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useForm, Controller } from 'react-hook-form'
import Image from 'next/image'
import Input from '@/components/Input'
import MButton from '@/components/MButton'
import { Checkbox } from '@mui/material'
import { useState } from 'react'
import { Logomark } from '@/components/Logo'
import api from '@/services/api'
import { JSONSchemaType } from 'ajv'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { UserProfile } from '@/types/users'
import { useAuth } from '@/contexts/AuthProvider'

const schema: JSONSchemaType<UserProfile> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
		name: { type: 'string', minLength: 2, maxLength: 40 },
		avatar_url: { type: 'string', format: 'url', maxLength: 256 },
	},
	required: ['email', 'name', 'avatar_url'],
}

export default function Register() {
	const { user } = useAuth()

	const { showError, showSuccess } = useToast()

	const { retrieveUser } = useAuth()

	const [acceptTerms, setAcceptTerms] = useState(false)

	const router = useRouter()

	const redirectedFrom = useSearchParams()?.get('redirectedFrom')

	const redirectTo =
		typeof redirectedFrom === 'string' ? redirectedFrom : '/home'

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<UserProfile>({
		defaultValues: {
			name: user?.name,
			email: user?.email,
			avatar_url: user?.avatar_url,
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = async ({ name, email, avatar_url }: UserProfile) => {
		try {
			await api.users.register({
				name,
				email,
				avatar_url,
			})
			await retrieveUser()
			showSuccess('Success')
			router.push(redirectTo)
		} catch (e: any) {
			showError(
				'Error registering user',
				api.getErrorMessage(e) || 'Try again later',
			)
		}
	}

	const onErrorSubmiting = () => {
		showError('Error registering user', 'Check the data and try again later.')
	}

	const handleAcceptTerms = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAcceptTerms(event.target.checked)
	}

	return (
		<div className="h-screen flex flex-col justify-center bg-slate-50">
			<Container className="w-full sm:w-96 h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 rounded-lg">
				<div className="w-full flex space-x-2 justify-between items-center py-3 mb-8 border-b border-slate-200">
					<Logomark className="w-6" />
					<h3 className="text-slate-700">Complete your registration</h3>
					<div />
				</div>
				<Image
					src={getValues('avatar_url') || ''}
					alt="Logo"
					width={128}
					height={128}
					className="mb-4 rounded-full border-2 border-slate-200"
					priority
				/>
				<div className="w-full flex flex-col space-y-6 px-8">
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
					onClick={handleSubmit(onSubmit, onErrorSubmiting)}
					loading={isSubmitting}
					disabled={
						!getValues('name') ||
						!getValues('email') ||
						!getValues('avatar_url') ||
						!acceptTerms
					}
				>
					Register Me
				</MButton>
			</Container>
		</div>
	)
}
