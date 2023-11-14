'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { usePreferences } from '@/contexts/PreferencesProvider'

export interface PopupAlertProps {
	message: string
}

export default function PopupAlert({ message }: PopupAlertProps) {
	const { showPreReleaseAlert, setShowPreReleaseAlert } = usePreferences()

	return showPreReleaseAlert ? (
		<div className="mt-4 w-full flex justify-center">
			<div className="w-full max-w-7xl px-4 lg:px-6 xl:px-8">
				<div className="flex border border-yellow-400 bg-yellow-50 rounded-lg p-2 font-semibold space-x-2 justify-between">
					<div className="flex space-x-2">
						<InformationCircleIcon className="w-6 h-6 text-yellow-600" />
						<p className="ml-1 text-sm text-yellow-600">{message}</p>
					</div>
					<button
						className="group hover:bg-yellow-600 rounded-full"
						onClick={() => setShowPreReleaseAlert(false)}
					>
						<XMarkIcon className="w-5 h-4 text-yellow-600 group-hover:text-white" />
					</button>
				</div>
			</div>
		</div>
	) : (
		<></>
	)
}
