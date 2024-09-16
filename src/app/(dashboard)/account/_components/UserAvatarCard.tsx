'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { UserAvatarEditable } from '@/components/UserAvatarEditable'
import { useAction } from 'next-safe-action/hooks'
import { updateUser } from '../actions'
import { User } from '@/core/client'

export function UserAvatarCard({
	value,
	...props
}: {
	value: User['avatar_url']
} & React.ComponentProps<typeof Card>) {
	const { executeAsync, isExecuting } = useAction(updateUser)

	const handleOnChange = async (avatar_url: string) => {
		await executeAsync({
			avatar_url,
		})
	}

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
					<CardTitle>Avatar</CardTitle>
					<CardDescription>
						This is your user&apos;s avatar. Click on the avatar to upload a
						custom one from your files.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					<UserAvatarEditable
						size={80}
						src={value}
						onChange={handleOnChange}
						isLoading={isExecuting}
					/>
				</CardContent>
			</div>
			<CardFooter className="bg-slate-100 pt-6 text-sm text-slate-600">
				An user avatar is optional.
			</CardFooter>
		</Card>
	)
}
