'use client'

import { usePreferences } from '@/contexts/PreferencesProvider'
import { InfoIcon, XIcon } from 'lucide-react'

export interface PopupAlertProps {
	message: string
}

export default function PopupAlert({ message }: PopupAlertProps) {
	const { showPreReleaseAlert, setShowPreReleaseAlert } = usePreferences()

	return showPreReleaseAlert ? (
		<div className="mt-4 flex w-full justify-center">
			<div className="w-full max-w-7xl px-4 lg:px-6 xl:px-8">
				<div className="flex items-center justify-between space-x-2 rounded-lg border border-yellow-400 bg-yellow-50 p-2 font-semibold">
					<div className="flex space-x-2">
						<InfoIcon className="h-6 w-6 text-yellow-600" />
						<p className="ml-1 text-sm text-yellow-600">{message}</p>
					</div>
					<button
						className="group h-5 w-5 rounded-full hover:bg-yellow-600"
						onClick={() => setShowPreReleaseAlert(false)}
					>
						<XIcon className="h-4 w-5 text-yellow-600 group-hover:text-white" />
					</button>
				</div>
			</div>
		</div>
	) : (
		<></>
	)
}
