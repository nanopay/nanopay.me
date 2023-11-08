'use client'

import { ReactNode } from 'react'
import { theme } from '@/styles/mui-theme'
import { ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'
import PreferencesProvider from '@/contexts/Preferences'
import { AuthProvider } from '@/contexts/Auth'

const queryClient = new QueryClient()

export default function ClientContexts({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider theme={theme}>
					<PreferencesProvider>
						{children}
						<ToastContainer />
					</PreferencesProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}
