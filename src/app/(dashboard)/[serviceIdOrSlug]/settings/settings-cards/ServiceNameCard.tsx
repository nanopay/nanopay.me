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
import { Service } from '@/core/client'
import { MAX_SERVICE_NAME_LENGTH } from '@/core/constants'
import { cn } from '@/lib/cn'

export default function ServiceNameCard({
	serviceId,
	value,
	...props
}: {
	serviceId: Service['id']
	value: Service['name']
} & React.ComponentProps<typeof Card>) {
	return (
		<Card
			{...props}
			className={cn('w-full overflow-hidden border-slate-200', props.className)}
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
					<Input value={value} />
				</div>
			</CardContent>
			<CardFooter className="border-t border-slate-200 bg-slate-100 pt-6">
				<div className="flex w-full items-center justify-between">
					<p className="text-sm text-slate-600">
						Please use {MAX_SERVICE_NAME_LENGTH} characters at maximum.
					</p>
					<Button
						// onClick={}
						className="font-semibold"
					>
						Save
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}
