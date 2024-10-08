'use client'

import Link from 'next/link'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { sendMagicLink } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

const schema = z.object({
	email: z.string().email(),
})

export default function MagicLinkPage() {
	const { showError } = useToast()

	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(schema),
	})

	const { executeAsync: onSubmit } = useAction(sendMagicLink, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Error sending magic link', message)
		},
	})

	return (
		<div className="flex w-full flex-col space-y-6 divide-y divide-slate-200 px-2 sm:px-4">
			<Form {...form}>
				<form
					className="w-full space-y-4 py-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<Input
										label="E-mail"
										{...field}
										invalid={fieldState.invalid}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						loading={form.formState.isSubmitting}
						disabled={!form.formState.isDirty}
					>
						Send Magic Link
					</Button>
				</form>
			</Form>
			<div className="flex flex-col items-center py-6">
				<h2 className="text-base font-semibold text-slate-600">
					Back to{' '}
					<Link href="/login" className="text-nano underline">
						Login
					</Link>
				</h2>
			</div>
		</div>
	)
}
