'use client'

import { Button } from '@/components/Button'
import Input from '@/components/Input'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { serviceContactEmailSchema } from '@/core/client/services/services-schema'
import type { Service } from '@/core/client'
import { cn } from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateService } from '../actions'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'

const schema = z.object({
	contact_email: serviceContactEmailSchema,
})

export default function ServiceContactEmailCard({
	serviceId,
	value,
	...props
}: {
	serviceId: Service['id']
	value: Service['contact_email']
} & React.ComponentProps<typeof Card>) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			contact_email: value,
		},
		resolver: zodResolver(schema),
	})

	const { executeAsync } = useAction(updateService, {})

	const onSubmit = async (values: z.infer<typeof schema>) => {
		await executeAsync({
			serviceIdOrSlug: serviceId,
			...values,
		})
	}

	const isSubmitting = form.formState.isSubmitting
	const isSubmitDisabled = isSubmitting || !form.formState.isDirty

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card
					{...props}
					className={cn(
						'w-full overflow-hidden border-slate-200',
						props.className,
					)}
				>
					<CardHeader>
						<CardTitle>Service Contact Email</CardTitle>
						<CardDescription>
							This is your service&apos;s contact email. Your customers will be
							able to see this in the invoices
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full max-w-sm">
							<FormField
								name="contact_email"
								control={form.control}
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												type="email"
												{...field}
												value={field.value || ''}
												invalid={fieldState.invalid}
												placeholder="contact@mail.com"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="border-t border-slate-200 bg-slate-100 pt-6">
						<div className="flex w-full items-center justify-between">
							<p className="text-sm text-slate-600">
								This is optional but strongly recommended.
							</p>
							<Button
								type="submit"
								className="font-semibold"
								loading={isSubmitting}
								disabled={isSubmitDisabled}
							>
								Save
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
