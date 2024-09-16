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
import { userNameSchema } from '@/core/client'
import { cn } from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateUser } from '../actions'
import { MAX_USER_NAME_LENGTH } from '@/core/constants'

const schema = z.object({ name: userNameSchema })

export function UserNameCard({
	value,
	...props
}: {
	value: string
} & React.ComponentProps<typeof Card>) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			name: value,
		},
		resolver: zodResolver(schema),
	})

	const { executeAsync } = useAction(updateUser)

	const onSubmit = async (values: z.infer<typeof schema>) => {
		await executeAsync({
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
						<CardTitle>User Name</CardTitle>
						<CardDescription>
							Please enter your name or a nickname you are comfortable with.
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
												placeholder="User Name"
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
								Please use {MAX_USER_NAME_LENGTH} characters at maximum.
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
