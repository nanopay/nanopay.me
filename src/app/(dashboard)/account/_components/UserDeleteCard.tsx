'use client'

import { Button } from '@/components/Button'
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { UserDeleteModal } from './UserDeleteModal'

export function UserDeleteCard({
	...props
}: React.ComponentProps<typeof Card>) {
	const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false)

	const handleopenDeleteUserModal = () => {
		setOpenDeleteUserModal(true)
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
					<CardTitle>Delete Account</CardTitle>
					<CardDescription>
						Permanently remove your Personal Account and all of its contents
						from the NanoPay.me platform. This action is not reversible — please
						continue with caution.
					</CardDescription>
				</CardHeader>
				<CardFooter className="bg-red-100 pt-6">
					<div className="flex w-full items-center justify-end">
						<Button
							variant="destructive"
							onClick={handleopenDeleteUserModal}
							className="font-semibold"
						>
							<TrashIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
							Delete Account
						</Button>
					</div>
				</CardFooter>
			</Card>

			<UserDeleteModal
				open={openDeleteUserModal}
				onOpenChange={setOpenDeleteUserModal}
			/>
		</>
	)
}
