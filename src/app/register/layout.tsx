import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex h-screen flex-col justify-center bg-slate-50">
			<Container className="flex h-screen w-full flex-col items-center space-y-6 rounded-lg border border-slate-200 bg-white px-16 pb-16 sm:h-auto sm:w-96">
				<div className="mb-8 flex w-full items-center justify-between space-x-2 border-b border-slate-200 py-3">
					<Logomark className="w-6" />
					<h3 className="text-slate-700">Complete your registration</h3>
					<div />
				</div>
				{children}
			</Container>
		</div>
	)
}
