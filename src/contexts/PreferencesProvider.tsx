'use client'

import { Service } from '@/types/services'
import { useParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface PreferencesContextValues {
	showPreReleaseAlert: boolean
	setShowPreReleaseAlert: (value: boolean) => void
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

	const serviceName = useParams()?.serviceName

	const currentService = services.find(
		service => service.name === serviceName,
	) as Service | null

	return (
		<PreferencesContext.Provider
			value={{
				showPreReleaseAlert,
				setShowPreReleaseAlert,
				currentService,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	)
}

export default PreferencesProvider

export const usePreferences = () => useContext(PreferencesContext)
