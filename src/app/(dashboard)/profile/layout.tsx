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
		<Container className="w-full max-w-xl h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 sm:rounded-lg">
			<div className="w-full flex justify-center items-center py-3 mb-8 border-b border-slate-200">
				<h3 className="text-slate-700">User Profile</h3>
			</div>
			{children}
		</Container>
	)
}
