'use client'

import { useToast } from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { useTransition } from 'react'
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
import { UserCreate } from '@/services/client'
import { userCreateSchema } from '@/services/client/user/user-schema'
export interface CompleteProfileFormProps {
	initialData: {
		name?: string
	}
}

export default function CompleteProfileForm({
	initialData,
}: CompleteProfileFormProps) {
	const [isPending, startTransition] = useTransition()

	const { showError } = useToast()

	const form = useForm<UserCreate>({
		defaultValues: {
			name: initialData.name,
		},
		resolver: zodResolver(userCreateSchema),
	})

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
					loading={form.formState.isSubmitting || isPending}
					disabled={!form.watch('name')}
				>
					Register
				</Button>
			</form>
		</Form>
	)
}
