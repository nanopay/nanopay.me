import { SessionProvider } from 'next-auth/react'
import '@/styles/tailwind.css'
import 'focus-visible'
import { AppProps } from 'next/app'

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}
