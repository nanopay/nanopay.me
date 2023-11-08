import '@/styles/styles.css'
import '@/styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Inter } from 'next/font/google'
import ClientContexts from './clientContexts'
import NProgressBar from '@/components/NProgressBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'NanoPay.me',
	description: 'Pay and receive payments with Nano.',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ClientContexts>
					<div className="min-h-screen flex flex-col">{children}</div>
					<NProgressBar />
				</ClientContexts>
			</body>
		</html>
	)
}
