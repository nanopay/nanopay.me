'use client'

import { ServiceAvatarEditable } from '@/components/ServiceAvatarEditable'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Service } from '@/core/client'
import { cn } from '@/lib/cn'

export default function ServiceAvatarCard({
	serviceId,
	serviceName,
	value,
	...props
}: {
	serviceId: Service['id']
	serviceName: Service['name']
	value: Service['avatar_url']
} & React.ComponentProps<typeof Card>) {
	return (
		<Card
			{...props}
			className={cn(
				'w-full divide-y divide-slate-200 overflow-hidden border-slate-200',
				props.className,
			)}
		>
			<div className="flex items-center justify-between">
				<CardHeader>
					<CardTitle>Service Avatar</CardTitle>
					<CardDescription>
						This is your service&apos;s avatar. Click on the avatar to upload a
						custom one from your files.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					<ServiceAvatarEditable
						id={serviceId}
						size={80}
						src={value}
						alt={serviceName}
					/>
				</CardContent>
			</div>
			<CardFooter className="bg-slate-100 pt-6 text-sm text-slate-600">
				An avatar is optional but strongly recommended.
			</CardFooter>
		</Card>
	)
}
