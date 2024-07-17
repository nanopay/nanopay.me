'use client'

import { usePreferences } from '@/contexts/PreferencesProvider'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { cn } from '@/lib/cn'

export interface PopupAlertProps
	extends React.ComponentPropsWithoutRef<typeof Alert> {
	message: string
}

export default function PopupAlert({ message, ...props }: PopupAlertProps) {
	const { showPreReleaseAlert, setShowPreReleaseAlert } = usePreferences()

	if (!showPreReleaseAlert) {
		return null
	}

	return (
		<Alert
			{...props}
			className={cn(
				'relative flex flex-col justify-between border-yellow-200 bg-yellow-50 md:flex-row md:gap-8',
				props.className,
			)}
		>
			<div>
				<div className="flex items-start gap-2">
					<AlertCircle className="h-4 w-4 text-yellow-800" />
					<AlertTitle className="text-yellow-800">Important</AlertTitle>
				</div>
				<AlertDescription className="text-yellow-900">
					{message}
				</AlertDescription>
			</div>
			<div className="flex justify-end">
				<button
					onClick={() => setShowPreReleaseAlert(false)}
					className="mt-2 h-fit w-16 rounded-md border border-yellow-600 px-2 py-1 text-yellow-800 hover:bg-yellow-600 hover:text-yellow-50"
				>
					Got it!
				</button>
			</div>
		</Alert>
	)
}
