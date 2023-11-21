import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="h-screen flex flex-col justify-center bg-slate-50">
			<Container className="w-full sm:w-96 h-screen sm:h-auto flex flex-col items-center space-y-6 bg-white px-16 pb-16 border border-slate-200 rounded-lg">
				<div className="w-full flex space-x-2 justify-between items-center py-3 mb-8 border-b border-slate-200">
					<Logomark className="w-6" />
					<h3 className="text-slate-700">Complete your registration</h3>
					<div />
				</div>
				{children}
			</Container>
		</div>
	)
}
