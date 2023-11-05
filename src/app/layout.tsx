import '@/styles/styles.css'
import '@/styles/tailwind.css'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Inter } from 'next/font/google'
import SupabaseProvider from './supabase-provider'
import { headers, cookies } from 'next/headers'
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
	const supabase = createServerComponentSupabaseClient({
		headers,
		cookies,
	})

	const {
		data: { session },
	} = await supabase.auth.getSession()

	return (
		<html lang="en">
			<body className={inter.className}>
				<SupabaseProvider session={session}>
					<ClientContexts>
						<div className="min-h-screen flex flex-col">{children}</div>
						<NProgressBar />
					</ClientContexts>
				</SupabaseProvider>
			</body>
		</html>
	)
}
