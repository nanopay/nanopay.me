'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/useToast'
import { createService } from './actions'
import { Button } from '@/components/Button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { ServiceCreate } from '@/core/client'
import { serviceCreateSchema } from '@/core/client/services/services-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAction } from 'next-safe-action/hooks'
import { getSafeActionError } from '@/lib/safe-action'

export default function NewService() {
	const { showError } = useToast()

	const [isUploading, setIsUploading] = useState(false)

	const form = useForm<ServiceCreate>({
		resolver: zodResolver(serviceCreateSchema),
	})

	const { executeAsync: onSubmit } = useAction(createService, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError('Error creating service', message)
		},
	})

	return (
		<Card className="w-full max-w-xl">
			<CardHeader className="mb-4 items-center border-b border-slate-200">
				<CardTitle>Create a Service</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="flex max-w-xl flex-col items-center space-y-2 pb-4 sm:px-16"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="flex w-full flex-col space-y-6 px-4 py-4 sm:px-8">
							<FormField
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												label="Service Name"
												{...field}
												invalid={fieldState.invalid}
												className="capitalize"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div />
						<Button
							loading={form.formState.isSubmitting}
							disabled={isUploading || !form.watch('name')}
						>
							Create Service
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
