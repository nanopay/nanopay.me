import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Open_Sans } from 'next/font/google'
import { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import { LoadingIndicator } from '@/components/LoadingIndicator'

export const runtime = 'edge'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: 'Nano Pay | NanoPay.me',
		template: '%s | NanoPay.me',
	},
	icons: {
		icon: [
			{ rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				url: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				url: '/favicon-16x16.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '192x192',
				url: '/android-chrome-192x192.png',
			},
		],
		apple: '/apple-touch-icon.png',
	},
	description: 'Pay and get paid with Nano.',
	manifest: '/site.webmanifest',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={openSans.className}>
				<div className="flex flex-col">{children}</div>
				<LoadingIndicator />
				<ToastContainer />
			</body>
		</html>
	)
}
