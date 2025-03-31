'use client'

import Link from 'next/link'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { passwordSchema } from '@/core/client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/Button'
import { changePassword } from './actions'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/core/constants'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

interface ResetPassword {
	password: string
	confirm_password: string
}

const schema = z.object({
	password: passwordSchema,
	confirm_password: passwordSchema,
})

export default function ResetPasswordPage({
	searchParams,
}: {
	searchParams: {
		next?: string
	}
}) {
	const { showError } = useToast()

	const form = useForm<ResetPassword>({
		defaultValues: {
			password: '',
			confirm_password: '',
		},
		resolver: zodResolver(schema),
	})

	const { executeAsync, isPending } = useAction(changePassword, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Error updating passsword', message)
		},
	})

	const onSubmit = async ({ password, confirm_password }: ResetPassword) => {
		if (password !== confirm_password) {
			showError('Passwords do not match', 'Passwords must be the same')
			return
		}
		await executeAsync({ password, next: searchParams.next })
	}

	return (
		<Form {...form}>
			<form
				className="flex w-full flex-col space-y-6 divide-y divide-neutral-200 px-2 sm:px-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="w-full space-y-4 py-6">
					<FormField
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel className="sr-only">New Password</FormLabel>
								<FormControl>
									<Input
										label="New Password"
										type="password"
										required
										minLength={MIN_PASSWORD_LENGTH}
										maxLength={MAX_PASSWORD_LENGTH}
										invalid={fieldState.invalid}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirm_password"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel className="sr-only">Confirm Password</FormLabel>
								<FormControl>
									<Input
										label="Confirm Password"
										type="password"
										required
										minLength={MIN_PASSWORD_LENGTH}
										maxLength={MAX_PASSWORD_LENGTH}
										invalid={fieldState.invalid}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						variant="destructive"
						loading={form.formState.isSubmitting || isPending}
					>
						Reset Password
					</Button>
				</div>
				<div className="flex flex-col items-center py-6">
					<h2 className="text-base font-semibold text-slate-600">
						Back to{' '}
						<Link href="/login" className="text-nano underline">
							Login
						</Link>
					</h2>
				</div>
			</form>
		</Form>
	)
}
