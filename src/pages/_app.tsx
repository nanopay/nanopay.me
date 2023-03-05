import '@/styles/tailwind.css'
import 'focus-visible'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
