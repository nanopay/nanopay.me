'use client'

import { useToast } from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Input from '@/components/Input'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { createUserProfile } from './actions'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import Link from 'next/link'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { UserCreate } from '@/services/client'
import { userCreateSchema } from '@/services/client/user/user-schema'
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

	const form = useForm<UserCreate>({
		defaultValues: {
			name: initialData.name,
			avatar_url: initialData.avatar_url || DEFAULT_AVATAR_URL,
		},
		resolver: zodResolver(userCreateSchema),
	})

	const handleAcceptTerms = (checked: CheckedState) => {
		setAcceptTerms(checked === true)
	}

	const onSubmit = async ({ name, avatar_url }: UserCreate) => {
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
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full max-w-sm flex-col items-center space-y-4"
			>
				<Image
					src={form.watch('avatar_url') || ''}
					alt="Logo"
					width={128}
					height={128}
					className="rounded-full border-2 border-slate-200"
					priority
				/>

				<FormField
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<Input
									label="Name *"
									{...field}
									onChange={e => field.onChange(e.target.value.slice(0, 40))}
									invalid={fieldState.invalid}
									className="capitalize"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Input name="email" label="E-mail" value={initialData.email} disabled />

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
					loading={form.formState.isSubmitting || isPending}
					disabled={!form.watch('name') || !initialData.email || !acceptTerms}
				>
					Register
				</Button>
			</form>
		</Form>
	)
}
