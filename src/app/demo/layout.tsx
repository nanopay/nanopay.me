import { LandingHeader } from '@/components/LandingHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Demo',
}

export default async function DemoLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<LandingHeader className="border-b border-slate-200 bg-white shadow-sm" />
			<div className="relative flex flex-1 flex-col items-center justify-center p-4">
				{children}
			</div>
		</>
	)
}
