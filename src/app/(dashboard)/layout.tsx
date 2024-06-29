import { Footer } from '@/components/Footer'
import Appbar from '@/components/Appbar'
import PopupAlert from '@/components/PopupAlert'
import { UserProvider } from '@/contexts/UserProvider'
import { redirect } from 'next/navigation'
import PreferencesProvider from '@/contexts/PreferencesProvider'
import { getCachedUser } from '@/lib/cache/user'
import { getCachedUserServices } from '@/lib/cache/services'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [user, services] = await Promise.all([
		getCachedUser(),
		getCachedUserServices(),
	])

	if (!user) {
		redirect('/complete-profile')
	}

	if (services.length === 0) {
		redirect('/services/new')
	}

	return (
		<UserProvider user={user}>
			<PreferencesProvider services={services}>
				<div className="flex w-full flex-1 flex-col">
					<Appbar services={services} />

					<div className="mx-auto w-full max-w-7xl px-4 py-4 lg:px-6 xl:px-8">
						<PopupAlert
							message="This is the alpha version. It may have bugs. Do not use in
								production or for high-value payments."
						/>
					</div>

					<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 pb-4 lg:px-6 xl:px-8">
						{children}
					</main>

					<Footer />
				</div>
			</PreferencesProvider>
		</UserProvider>
	)
}
