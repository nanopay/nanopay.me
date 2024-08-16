'use client'

import {
	AlertTriangleIcon,
	KeyRoundIcon,
	ReceiptIcon,
	WebhookIcon,
	XIcon,
} from 'lucide-react'
import { Button } from '@/components/Button'
import { deleteService } from './actions'
import { Service } from '@/core/client'
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
import { useEffect, useState } from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import Input from '@/components/Input'
import { ServiceAvatar } from '@/components/ServiceAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ServiceWebsiteCard from './settings-cards/ServiceWebsiteCard'
import ServiceContactEmailCard from './settings-cards/ServiceContactEmailCard'
import ServiceAvatarCard from './settings-cards/ServiceAvatar'
import ServiceNameCard from './settings-cards/ServiceNameCard'
import ServiceDeleteCard from './settings-cards/ServiceDeleteCard'
export interface SettingsProps {
	service: Service
}

export function Settings({ service }: SettingsProps) {
	return (
		<>
			<div className="flex flex-col space-y-8">
				<ServiceNameCard serviceId={service.id} value={service.name} />

				<ServiceAvatarCard
					serviceId={service.id}
					serviceName={service.name}
					value={service.avatar_url}
				/>

				<ServiceContactEmailCard
					serviceId={service.id}
					value={service.contact_email}
				/>

				<ServiceWebsiteCard serviceId={service.id} value={service.website} />

				<ServiceDeleteCard service={service} />
			</div>
		</>
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
