import { Container } from '@/components/Container'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'User Profile',
}

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Container className="flex h-screen w-full max-w-xl flex-col items-center space-y-6 border border-slate-200 bg-white px-16 pb-16 sm:h-auto sm:rounded-lg">
			<div className="mb-8 flex w-full items-center justify-center border-b border-slate-200 py-3">
				<h3 className="text-slate-700">User Profile</h3>
			</div>
			{children}
		</Container>
	)
}
