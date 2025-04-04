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
import { Service, serviceWebsiteSchema } from '@/core/client'
import { cn } from '@/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlobeIcon } from 'lucide-react'
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
import { ensureHttpOrHttps } from '@/utils/url'
import Image from 'next/image'

const schema = z.object({ website: serviceWebsiteSchema })

export default function ServiceWebsiteCard({
	serviceId,
	value,
	...props
}: {
	serviceId: Service['id']
	value: Service['website']
} & React.ComponentProps<typeof Card>) {
	const form = useForm<z.infer<typeof schema>>({
		defaultValues: {
			website: value,
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
						<CardTitle>Service Website</CardTitle>
						<CardDescription>
							This is your service&apos;s website URL. Your customers will be
							able to see this in the invoices
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full max-w-sm">
							<FormField
								name="website"
								control={form.control}
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												invalid={fieldState.invalid}
												value={field.value || ''}
												placeholder="https://example.com"
												icon={<WebsiteIcon url={field.value} />}
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
								This is optional but strongly recommended if your service has a
								website.
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

function WebsiteIcon({ url }: { url: string | null }) {
	const safeUrl = url ? ensureHttpOrHttps(url) : ''
	const isValidURL = URL.canParse(safeUrl)

	const size = 24

	const iconBaseUrl = 'https://t3.gstatic.com/faviconV2'
	const iconUrl =
		url && URL.canParse(url)
			? `${iconBaseUrl}?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${safeUrl}&size=${size}`
			: iconBaseUrl

	return url && isValidURL ? (
		<Image
			src={iconUrl}
			width={size}
			height={size}
			alt="Website icon"
			unoptimized
		/>
	) : (
		<GlobeIcon size={size} />
	)
}
