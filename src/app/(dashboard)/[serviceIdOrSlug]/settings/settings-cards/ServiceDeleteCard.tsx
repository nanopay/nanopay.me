import { Button } from '@/components/Button'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Service } from '@/core/client'
import { cn } from '@/lib/cn'
import { TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DeleteServiceAlertModal } from '../settings'

export default function ServiceDeleteCard({
	service,
	...props
}: {
	service: Service
} & React.ComponentProps<typeof Card>) {
	const [openDeleteServiceAlert, setOpenDeleteServiceAlert] = useState(false)

	const handleOpenDeleteServiceAlert = () => {
		setOpenDeleteServiceAlert(true)
	}

	return (
		<>
			<Card
				{...props}
				className={cn(
					'w-full divide-y divide-red-200 overflow-hidden border-red-200',
					props.className,
				)}
			>
				<CardHeader>
					<CardTitle>Delete Service</CardTitle>
					<CardDescription>
						Permanently remove your service and all of its contents from the
						NanoPay.me platform. This action is not reversible — please continue
						with caution.
					</CardDescription>
				</CardHeader>
				<CardFooter className="bg-red-100 pt-6">
					<div className="flex w-full items-center justify-between">
						<p className="font-medium text-red-600">
							To delete your account, visit{' '}
							<Link href="/account" className="text-nano hover:underline">
								Account Settings.
							</Link>
						</p>
						<Button
							variant="destructive"
							onClick={handleOpenDeleteServiceAlert}
							className="font-semibold"
						>
							<TrashIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
							Delete Service
						</Button>
					</div>
				</CardFooter>
			</Card>

			<DeleteServiceAlertModal
				service={service}
				open={openDeleteServiceAlert}
				onOpenChange={setOpenDeleteServiceAlert}
			/>
		</>
	)
}
