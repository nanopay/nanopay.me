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
import { DialogDescription, DialogProps } from '@radix-ui/react-dialog'
import Input from '@/components/Input'
import { ServiceAvatar } from '@/components/ServiceAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangleIcon } from 'lucide-react'
import { deleteUser } from '../actions'
import { Button } from '@/components/Button'
import { usePreferences } from '@/contexts/PreferencesProvider'
import { useUser } from '@/contexts/UserProvider'
import Link from 'next/link'
import Image from 'next/image'
import { DEFAULT_AVATAR_URL } from '@/core/constants'

const TYPE_TO_CONFIRM_DELETION = 'DELETE ACCOUNT'

export function UserDeleteModal({ ...props }: DialogProps) {
	const { showError } = useToast()
	const { services } = usePreferences()
	const user = useUser()

	const [wantToDelete, setWantToDelete] = useState(false)
	const [understandEffects, setUnderstandEffects] = useState(false)
	const [typeConfirm, setTypeConfirm] = useState('')

	const { execute, isExecuting } = useAction(deleteUser, {
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

	const handleDeleteAccount = () => {
		execute(true)
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
	}, [services])

	return (
		<Dialog modal {...props}>
			<DialogContent
				className="divide-x-slate-200 gap-0 divide-y p-0"
				onAnimationEndCapture={handleResetOnClose}
			>
				<DialogHeader className="px-6 py-4">
					<DialogTitle className="text-2xl">
						Delete Personal Account
					</DialogTitle>
					{services.length > 0 && (
						<DialogDescription className="py-2 text-base">
							You have access to {services.length} services. You must delete all
							of them before you can delete your Personal Account.
						</DialogDescription>
					)}
				</DialogHeader>
				<div className="flex flex-col items-center bg-slate-100 p-4">
					{services.length > 0 ? (
						<ul className="flex w-full flex-col divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white text-sm text-slate-700">
							{services.map(service => (
								<li
									key={service.id}
									className="flex flex-row items-center gap-4 p-4"
								>
									<ServiceAvatar
										id={service.id}
										size={24}
										src={service.avatar_url}
										alt={service.name}
									/>
									<p className="flex-1">{service.name}</p>
									<Link
										href={`/${service.slug}/settings`}
										target="_blank"
										className="text-nano text-xs font-medium hover:underline"
									>
										Settings
									</Link>
								</li>
							))}
						</ul>
					) : (
						<>
							<Image
								src={user.avatar_url || DEFAULT_AVATAR_URL}
								alt={user.name}
								width={64}
								height={64}
								className="rounded-full"
							/>
							<p className="mt-2 text-lg font-bold">{user.name}</p>
						</>
					)}
				</div>
				{wantToDelete && !understandEffects && (
					<div className="w-full p-4">
						<Alert className="border-yellow-700 bg-yellow-50 text-slate-800">
							<AlertTriangleIcon className="h-5 w-5 !text-yellow-500" />
							<AlertTitle>Are you absolutely sure?</AlertTitle>
							<AlertDescription>
								This action cannot be undone. This will permanently delete your
								account <b>{user.name}</b> from our servers.
							</AlertDescription>
						</Alert>
					</div>
				)}
				{understandEffects && (
					<div className="w-full p-4">
						<p className="py-2 font-medium">
							To confirm, type &quot;
							<b>{TYPE_TO_CONFIRM_DELETION}</b>&quot; in the box below
						</p>
						<Input
							invalid={typeConfirm !== TYPE_TO_CONFIRM_DELETION}
							value={typeConfirm}
							onChange={e => {
								setTypeConfirm(e.target.value.toUpperCase())
							}}
						/>
					</div>
				)}
				<DialogFooter className="bg-slate-100 p-4">
					<div className="w-full space-y-2">
						{(understandEffects && (
							<Button
								variant="destructive"
								loading={isExecuting}
								onClick={handleDeleteAccount}
								className="w-full"
								disabled={typeConfirm !== TYPE_TO_CONFIRM_DELETION}
							>
								Delete this account
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
							)) ||
							(services.length === 0 && (
								<Button
									variant="destructive"
									onClick={handleWantToDelete}
									className="w-full"
								>
									I want delete my account
								</Button>
							))}
						<DialogClose asChild>
							<Button
								variant="outline"
								className="hover:bg-nano/10 hover:border-nano/40 w-full font-semibold"
								color="slate"
								size="lg"
							>
								Cancel
							</Button>
						</DialogClose>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
