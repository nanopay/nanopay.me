'use client'

import { Service } from '@/types/services'
import { useParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface PreferencesContextValues {
	showPreReleaseAlert: boolean
	setShowPreReleaseAlert: (value: boolean) => void
	sidebarOpen: boolean
	setSidebarOpen: (value: boolean) => void
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
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [currentService, setCurrentService] = useState<null | Service>(null)

	const serviceName = useParams()?.serviceName

	useEffect(() => {
		if (serviceName) {
			setCurrentService(
				services?.find(service => service.name === serviceName) || null,
			)
		} else {
			setCurrentService(null)
		}
	}, [services, serviceName])

	return (
		<PreferencesContext.Provider
			value={{
				showPreReleaseAlert,
				setShowPreReleaseAlert,
				sidebarOpen,
				setSidebarOpen,
				currentService,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	)
}

export default PreferencesProvider

export const usePreferences = () => useContext(PreferencesContext)
