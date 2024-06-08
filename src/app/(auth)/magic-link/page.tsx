'use client'

import Link from 'next/link'
import Input from '@/components/Input'
import { ajvResolver } from '@hookform/resolvers/ajv'
import { JSONSchemaType } from 'ajv'
import { fullFormats } from 'ajv-formats/dist/formats'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/useToast'
import { useTransition } from 'react'
import { sendMagicLink } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'

interface MagicEmail {
	email: string
}

const schema: JSONSchemaType<MagicEmail> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email', maxLength: 128 },
	},
	required: ['email'],
}

export default function MagicLinkPage() {
	const [isPending, startTransition] = useTransition()

	const { showError } = useToast()

	const form = useForm<MagicEmail>({
		defaultValues: {
			email: '',
		},
		resolver: ajvResolver(schema, {
			formats: fullFormats,
		}),
	})

	const onSubmit = ({ email }: MagicEmail) => {
		startTransition(async () => {
			try {
				await sendMagicLink(email)
			} catch (error) {
				showError(
					'Error sending magic link',
					error instanceof Error
						? error.message
						: 'Check the email or try again later.',
				)
			}
		})
	}

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
						loading={form.formState.isSubmitting || isPending}
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
