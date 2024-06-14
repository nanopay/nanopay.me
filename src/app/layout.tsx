import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Open_Sans } from 'next/font/google'
import NProgressBar from '@/components/NProgressBar'
import { ToastContainer } from 'react-toastify'

const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata = {
	title: {
		default: 'Nano Pay | NanoPay.me',
		template: '%s | NanoPay.me',
	},
	description: 'Pay and receive payments with Nano.',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={openSans.className}>
				<div className="flex min-h-screen flex-col">{children}</div>
				<NProgressBar />
				{children}
				<ToastContainer />
			</body>
		</html>
	)
}
