import { Footer } from '@/components/Footer'
import { TransitionSidebar } from '@/components/Sidebar'
import Appbar from '@/components/Appbar'
import PopupAlert from '@/components/PopupAlert'
import { UserProvider } from '@/contexts/UserProvider'
import { getUserId } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import api from '@/services/api'
import { redirect } from 'next/navigation'
import PreferencesProvider from '@/contexts/PreferencesProvider'

async function fetchData() {
	const userId = await getUserId(cookies())

	const [user, services] = await Promise.all([
		api.users.retrieve({
			headers: {
				Cookie: cookies().toString(),
			},
			next: {
				revalidate: false,
				tags: [`user-${userId}`],
			},
		}),
		api.services.list({
			headers: {
				Cookie: cookies().toString(),
			},
			next: {
				revalidate: false,
				tags: [`user-${userId}-services`],
			},
		}),
	])

	return {
		user,
		services,
	}
}

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	try {
		const { user, services } = await fetchData()

		return (
			<UserProvider user={user}>
				<PreferencesProvider services={services}>
					<div className="flex w-full flex-1 flex-col">
						<TransitionSidebar services={services} />

						<Appbar />

						<div className="flex flex-1 flex-col lg:pl-72">
							<PopupAlert
								message="This is the alpha version. It may have bugs. Do not use in
								production or for high-value payments."
							/>

							<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 lg:px-6 xl:px-8">
								{children}
							</main>

							<Footer />
						</div>
					</div>
				</PreferencesProvider>
			</UserProvider>
		)
	} catch (error) {
		if (error instanceof Error && error.message === 'user not found') {
			redirect('/register')
		}
	}
}
