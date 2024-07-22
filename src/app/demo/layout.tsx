import { PlayIcon } from 'lucide-react'
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
		<div className="relative flex flex-1 flex-col items-center justify-center px-4 pt-20">
			<div
				role="alert"
				className="bg-nano absolute left-0 right-0 top-0 z-10 flex items-center justify-center p-4 text-white"
			>
				<PlayIcon size="24" />
				<h1 className="ml-2 text-xl font-bold">NANOPAY DEMO</h1>
			</div>
			{children}
		</div>
	)
}
