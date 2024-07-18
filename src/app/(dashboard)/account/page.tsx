'use client'

import Input from '@/components/Input'
import { useUser } from '@/contexts/UserProvider'
import { useToast } from '@/hooks/useToast'
import { useForm } from 'react-hook-form'
import { updateUser } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { userNameSchema, UserUpdate } from '@/core/client'
import { UserAvatarEditable } from '@/components/UserAvatarEditable'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

const schema = z.object({
	name: userNameSchema,
})

export default function AccountSettings() {
	const user = useUser()

	const { showError } = useToast()

	const form = useForm<UserUpdate>({
		defaultValues: {
			name: user.name,
		},
		resolver: zodResolver(schema),
	})

	const { executeAsync: onSubmit } = useAction(updateUser, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Error updating user', message)
		},
	})

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
					loading={form.formState.isSubmitting}
					disabled={!form.formState.isDirty}
				>
					Update
				</Button>
			</form>
		</Form>
	)
}
