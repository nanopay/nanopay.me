'use client'

import { Service } from '@/core/client'
import { useParams } from 'next/navigation'
import { createContext, useContext, useState } from 'react'

interface PreferencesContextValues {
	showPreReleaseAlert: boolean
	setShowPreReleaseAlert: (value: boolean) => void
	services: Service[]
	currentService: Service | null
}

interface PreferencesProviderProps {
	services: Service[]
	children: React.ReactNode
}

const PreferencesContext = createContext({} as PreferencesContextValues)

export const PreferencesProvider = ({
	services,
	children,
}: PreferencesProviderProps) => {
	const [showPreReleaseAlert, setShowPreReleaseAlert] = useState(true)

	const serviceIdOrSlug = useParams()?.serviceIdOrSlug

	const currentService = services.find(
		service => service.slug === serviceIdOrSlug,
	) as Service | null

	return (
		<PreferencesContext.Provider
			value={{
				showPreReleaseAlert,
				setShowPreReleaseAlert,
				services,
				currentService,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	)
}

export default PreferencesProvider

export const usePreferences = () => useContext(PreferencesContext)
