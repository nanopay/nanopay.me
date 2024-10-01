import { LandingHeader } from '@/components/LandingHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Sponsors',
}

export default function SponsorsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col from-[#F0F8FF] md:h-screen md:bg-gradient-to-b md:to-rose-50/60">
			<LandingHeader className="sticky top-0 border-b border-slate-200 bg-white" />
			<main className="flex flex-1 flex-col items-center justify-center overflow-hidden p-4">
				{children}
			</main>
		</div>
	)
}
