'use client'

import { ReactNode } from 'react'
import { theme } from '@/styles/mui-theme'
import { ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'
import PreferencesProvider from '@/contexts/Preferences'

const queryClient = new QueryClient()

export default function ClientContexts({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<PreferencesProvider>
					{children}
					<ToastContainer />
				</PreferencesProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}