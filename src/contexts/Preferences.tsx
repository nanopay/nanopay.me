import { createContext, useContext, useState } from 'react'

interface PreferencesContextValues {
	showPreReleaseAlert: boolean
	setShowPreReleaseAlert: (value: boolean) => void
}

interface PreferencesProviderProps {
	children: React.ReactNode
}

const PreferencesContext = createContext({} as PreferencesContextValues)

export const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
	const [showPreReleaseAlert, setShowPreReleaseAlert] = useState(true)

	return (
		<PreferencesContext.Provider
			value={{
				showPreReleaseAlert,
				setShowPreReleaseAlert,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	)
}

export default PreferencesProvider

export const usePreferences = () => useContext(PreferencesContext)
