'use client'

import {
	AlertTriangleIcon,
	GlobeIcon,
	KeyRoundIcon,
	ReceiptIcon,
	TrashIcon,
	WebhookIcon,
	XIcon,
} from 'lucide-react'
import { Button } from '@/components/Button'
import { deleteService } from './actions'
import { Service } from '@/services/client'
import { ServiceAvatarEditable } from '@/components/ServiceAvatarEditable'
import { useAction } from 'next-safe-action/hooks'
import { useToast } from '@/hooks/useToast'
import { getSafeActionError } from '@/lib/safe-action'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import Input from '@/components/Input'
import { ServiceAvatar } from '@/components/ServiceAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
export interface SettingsProps {
	service: Service
}

export function Settings({ service }: SettingsProps) {
	const { showError } = useToast()

	const [openDeleteServiceAlert, setOpenDeleteServiceAlert] = useState(false)

	const handleOpenDeleteServiceAlert = () => {
		setOpenDeleteServiceAlert(true)
	}

	return (
		<header className="rounded-lg bg-white shadow">
			<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
				<div className="py-6 md:flex md:items-center md:justify-between">
					<div className="min-w-0 flex-1">
						{/* Service Profile */}
						<div className="flex items-center">
							<div className="hidden sm:flex">
								<ServiceAvatarEditable
									id={service.id}
									size={64}
									src={service.avatar_url}
									alt={service.display_name}
								/>
							</div>
							<div>
								<div className="flex items-center">
									<div className="sm:hidden">
										<ServiceAvatarEditable
											id={service.id}
											size={64}
											src={service.avatar_url}
											alt={service.display_name}
										/>
									</div>
									<h1 className="ml-3 text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:leading-9">
										{service.name}
									</h1>
								</div>
								<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
									<dt className="sr-only">Website</dt>
									{service.website && (
										<dd className="sm:mr-6">
											<a
												href={service.website}
												className="hover:text-nano flex items-center truncate text-sm font-medium text-slate-500"
											>
												<GlobeIcon
													className="mr-1 h-5 w-5 flex-shrink-0"
													aria-hidden="true"
												/>
												{service.website}
											</a>
										</dd>
									)}
									{service.description && (
										<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
											{service.description.slice(0, 60)}
											{service.description.length > 60 && '...'}
										</dd>
									)}
								</dl>
							</div>
						</div>
					</div>
					<div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
						<Button
							variant="destructive"
							color="nano"
							onClick={handleOpenDeleteServiceAlert}
						>
							<TrashIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
							Delete
						</Button>
					</div>
				</div>
			</div>
			<DeleteServiceAlertModal
				service={service}
				open={openDeleteServiceAlert}
				onOpenChange={setOpenDeleteServiceAlert}
			/>
		</header>
	)
}

export interface DeleteServiceAlertModalProps extends DialogProps {
	service: Service
}

export function DeleteServiceAlertModal({
	service,
	...props
}: DeleteServiceAlertModalProps) {
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
		execute(service.name)
	}

	return (
		<Dialog modal {...props}>
			<DialogContent className="divide-x-slate-200 gap-0 divide-y p-0">
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
						alt={service.display_name}
					/>
					<p className="mt-2 text-lg font-bold">{service.display_name}</p>
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
							<b>{service.name}</b>&quot; in the box below
						</p>
						<Input
							invalid={typeConfirm !== service.name}
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
							disabled={typeConfirm !== service.name}
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
