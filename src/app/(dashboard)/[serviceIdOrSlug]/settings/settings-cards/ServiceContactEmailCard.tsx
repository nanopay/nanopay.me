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
import { cn } from '@/lib/cn'

export default function ServiceContactEmailCard({
	serviceId,
	value,
	...props
}: {
	serviceId: Service['id']
	value: Service['contact_email']
} & React.ComponentProps<typeof Card>) {
	return (
		<Card
			{...props}
			className={cn('w-full overflow-hidden border-slate-200', props.className)}
		>
			<CardHeader>
				<CardTitle>Service Contact Email</CardTitle>
				<CardDescription>
					This is your service&apos;s contact email. Your customers will be able
					to see this in the invoices
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="w-full max-w-sm">
					<Input value={value || ''} label="email" />
				</div>
			</CardContent>
			<CardFooter className="border-t border-slate-200 bg-slate-100 pt-6">
				<div className="flex w-full items-center justify-between">
					<p className="text-sm text-slate-600">
						This is optional but strongly recommended.
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
