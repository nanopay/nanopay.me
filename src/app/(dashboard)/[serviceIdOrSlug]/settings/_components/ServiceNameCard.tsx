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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Service, serviceNameSchema } from '@/core/client'
import { MAX_SERVICE_NAME_LENGTH } from '@/core/constants'
import { cn } from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateService } from '../actions'

const schema = z.object({ name: serviceNameSchema })

export default function ServiceNameCard({
	serviceId,
	value,
	...props
}: {
	serviceId: Service['id']
	value: Service['name']
} & React.ComponentProps<typeof Card>) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			name: value,
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
						<CardTitle>Service Name</CardTitle>
						<CardDescription>
							This is your service&apos;s visible name within NanoPay.me. For
							example, the name of your company, organization, project.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full max-w-sm">
							<FormField
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												invalid={fieldState.invalid}
												placeholder="My Service Name"
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
								Please use {MAX_SERVICE_NAME_LENGTH} characters at maximum.
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
