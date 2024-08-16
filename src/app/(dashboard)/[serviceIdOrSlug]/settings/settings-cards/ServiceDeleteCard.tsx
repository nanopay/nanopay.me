'use client'

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
import { useEffect, useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { useToast } from '@/hooks/useToast'
import { getSafeActionError } from '@/lib/safe-action'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import Input from '@/components/Input'
import { ServiceAvatar } from '@/components/ServiceAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	AlertTriangleIcon,
	KeyRoundIcon,
	ReceiptIcon,
	WebhookIcon,
	XIcon,
} from 'lucide-react'
import { deleteService } from '../actions'

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

export function DeleteServiceAlertModal({
	service,
	...props
}: DialogProps & {
	service: Service
}) {
	const { showError } = useToast()

	const [wantToDelete, setWantToDelete] = useState(false)
	const [understandEffects, setUnderstandEffects] = useState(false)
	const [typeConfirm, setTypeConfirm] = useState('')

	const { execute, isExecuting } = useAction(deleteService, {
		onError: ({ error }) => {
			const { message } = getSafeActionError(error)
			showError(message)
		},
	})

	const handleWantToDelete = () => {
		setWantToDelete(true)
	}

	const handleUnderstandEffects = () => {
		setUnderstandEffects(true)
	}

	const handleDeleteService = () => {
		execute(service.id)
	}

	const reset = () => {
		setWantToDelete(false)
		setUnderstandEffects(false)
		setTypeConfirm('')
	}

	const handleResetOnClose = () => {
		if (!props.modal) {
			reset()
		}
	}

	useEffect(() => {
		reset()
	}, [service])

	return (
		<Dialog modal {...props}>
			<DialogContent
				className="divide-x-slate-200 gap-0 divide-y p-0"
				onAnimationEndCapture={handleResetOnClose}
			>
				<DialogHeader className="flex flex-row items-center justify-between px-4 py-2">
					<DialogTitle>Delete your service?</DialogTitle>
					<DialogClose>
						<Button
							size="icon"
							variant="outline"
							color="slate"
							className="border-0 focus:bg-slate-100"
							autoFocus
						>
							<XIcon className="h-5 w-5" />
						</Button>
					</DialogClose>
				</DialogHeader>
				<div className="flex flex-col items-center p-4">
					<ServiceAvatar
						id={service.id}
						size={64}
						src={service.avatar_url}
						alt={service.name}
					/>
					<p className="mt-2 text-lg font-bold">{service.name}</p>
					<ul className="flex items-center space-x-2 divide-x divide-slate-200 p-4 text-sm text-slate-600">
						<li className="flex flex-col items-center px-4">
							<ReceiptIcon className="h-4 w-4" />
							<p>{service.invoices_count} invoices</p>
						</li>
						<li className="flex flex-col items-center px-4">
							<KeyRoundIcon className="h-4 w-4" />
							<p>{service.api_keys_count} API Keys</p>
						</li>
						<li className="flex flex-col items-center px-4">
							<WebhookIcon className="h-4 w-4" />
							<p>{service.webhooks_count} Webhooks</p>
						</li>
					</ul>
				</div>
				{wantToDelete && !understandEffects && (
					<div className="w-full p-4">
						<Alert className="border-yellow-700 bg-yellow-50 text-slate-800">
							<AlertTriangleIcon className="h-5 w-5 !text-yellow-500" />
							<AlertTitle>Are you absolutely sure?</AlertTitle>
							<AlertDescription>
								This action cannot be undone. This will permanently delete your
								service <b>{service.name}</b> and remove your service data from
								our servers, including all invoices, payments, webhooks, api
								keys, and other data.
							</AlertDescription>
						</Alert>
					</div>
				)}
				{understandEffects && (
					<div className="w-full p-4">
						<p className="py-2 font-medium">
							To confirm, type &quot;
							<b>{service.slug}</b>&quot; in the box below
						</p>
						<Input
							invalid={typeConfirm !== service.slug}
							value={typeConfirm}
							onChange={e => {
								setTypeConfirm(e.target.value)
							}}
						/>
					</div>
				)}
				<DialogFooter className="p-4">
					{(understandEffects && (
						<Button
							variant="destructive"
							loading={isExecuting}
							onClick={handleDeleteService}
							className="w-full"
							disabled={typeConfirm !== service.slug}
						>
							Delete this service
						</Button>
					)) ||
						(wantToDelete && (
							<Button
								variant="destructive"
								onClick={handleUnderstandEffects}
								className="w-full"
							>
								I have read and understand these effects
							</Button>
						)) || (
							<Button
								variant="destructive"
								onClick={handleWantToDelete}
								className="w-full"
							>
								I want delete this service
							</Button>
						)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
