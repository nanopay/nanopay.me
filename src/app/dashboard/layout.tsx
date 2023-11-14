import { Footer } from '@/components/Footer'
import { TransitionSidebar } from '@/components/Sidebar'
import Appbar from '@/components/Appbar'
import PopupAlert from '@/components/PopupAlert'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="w-full flex flex-col flex-1">
			<TransitionSidebar />

			<Appbar />

			<div className="lg:pl-72 flex flex-col flex-1">
				<PopupAlert
					message="This is the alpha version. It may have bugs. Do not use in
							production or for high-value payments."
				/>

				<main className="flex flex-col w-full flex-1 py-6 px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
					{children}
				</main>

				<Footer />
			</div>
		</div>
	)
}
