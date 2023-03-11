import { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import '@/styles/tailwind.css'
import 'focus-visible'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@mui/material/styles'
import 'react-toastify/dist/ReactToastify.css'
import { theme } from '@/styles/mui-theme'

const queryClient = new QueryClient()

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient())

	return (
		<QueryClientProvider client={queryClient}>
			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<ThemeProvider theme={theme}>
					<Component {...pageProps} />
					<ToastContainer />
				</ThemeProvider>
			</SessionContextProvider>
		</QueryClientProvider>
	)
}
