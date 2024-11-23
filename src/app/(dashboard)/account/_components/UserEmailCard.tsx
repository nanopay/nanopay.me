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
import { cn } from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { userSchema } from '@/core/client'

const schema = z.object({
	email: userSchema.shape.email,
})

export function UserEmailCard({
	value,
	...props
}: {
	value: string
} & React.ComponentProps<typeof Card>) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			email: value,
		},
		resolver: zodResolver(schema),
	})

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value)
	}

	return (
		<Form {...form}>
			<form>
				<Card
					{...props}
					className={cn(
						'w-full overflow-hidden border-slate-200',
						props.className,
					)}
				>
					<CardHeader>
						<CardTitle>Email</CardTitle>
						<CardDescription>
							The email address used to log in with NanoPay.me and receive
							account-related notifications.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full max-w-sm">
							<FormField
								name="email"
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
												disabled
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
								Emails must be verified to be able to login with them or be used
								as primary email.
							</p>
							<Button
								type="button"
								className="font-semibold"
								onClick={handleCopy}
							>
								Copy
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</Form>
	)
}
