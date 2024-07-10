'use client'

import Input from '@/components/Input'
import { useUser } from '@/contexts/UserProvider'
import { useToast } from '@/hooks/useToast'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { UpdateUserProps, updateUser } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { UserUpdate, userNameSchema } from '@/services/client'
import { UserAvatarEditable } from '@/components/UserAvatarEditable'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	name: userNameSchema,
})

export default function Profile() {
	const user = useUser()

	const { showError } = useToast()

	const [isPending, startTransition] = useTransition()

	const form = useForm<UpdateUserProps>({
		defaultValues: {
			name: user.name,
		},
		resolver: zodResolver(schema),
	})

	const onSubmit = async ({ name }: Partial<UserUpdate>) => {
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
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full max-w-sm flex-col items-center space-y-6"
			>
				<UserAvatarEditable src={user.avatar_url} alt={user.name} />

				<div className="flex w-full flex-col space-y-4">
					<FormField
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="Name"
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

					<Input name="email" label="E-mail" value={user.email} disabled />
				</div>
				<Button
					type="submit"
					loading={form.formState.isSubmitting || isPending}
					disabled={!form.formState.isDirty}
				>
					Update
				</Button>
			</form>
		</Form>
	)
}
