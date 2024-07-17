'use client'

import { useToast } from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserProfile } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { UserCreate } from '@/core/client'
import { userCreateSchema } from '@/core/client/user/user-schema'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'
export interface CompleteProfileFormProps {
	initialData: {
		name?: string
	}
}

export default function CompleteProfileForm({
	initialData,
}: CompleteProfileFormProps) {
	const { showError } = useToast()

	const form = useForm<UserCreate>({
		defaultValues: {
			name: initialData.name,
		},
		resolver: zodResolver(userCreateSchema),
	})

	const { executeAsync: onSubmit } = useAction(createUserProfile, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Error creating user profile', message)
		},
	})

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full max-w-sm flex-col items-center space-y-4"
			>
				<FormField
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<Input
									label="Your Name *"
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
				<Button
					type="submit"
					loading={form.formState.isSubmitting}
					disabled={!form.watch('name')}
				>
					Register
				</Button>
			</form>
		</Form>
	)
}
