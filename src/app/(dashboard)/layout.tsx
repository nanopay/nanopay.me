import { Footer } from '@/components/Footer'
import { TransitionSidebar } from '@/components/Sidebar'
import Appbar from '@/components/Appbar'
import PopupAlert from '@/components/PopupAlert'
import { UserProvider } from '@/contexts/UserProvider'
import { createClient, getUserId } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PreferencesProvider from '@/contexts/PreferencesProvider'
import { unstable_cache } from 'next/cache'
import { Service } from '@/types/services'
import { User } from '@/types/users'

export async function fetchUser(): Promise<User> {
	const supabase = createClient(cookies())

	const { data, error } = await supabase.from('profiles').select('*').single()

	if (error && error.code !== 'PGRST116') {
		throw new Error(error.message)
	}

	if (!data) {
		// User has been deleted
		await supabase.auth.signOut()
		redirect('/login')
	}

	return {
		id: data.user_id,
		name: data.name,
		email: data.email,
		avatar_url: data.avatar_url,
	}
}

export async function fetchUserServices(): Promise<Service[]> {
	const supabase = createClient(cookies())

	const { data, error } = await supabase.from('services').select('*')

	if (error && error.code !== 'PGRST116') {
		throw new Error(error.message)
	}

	return data || []
}

async function fetchData() {
	const userId = await getUserId(cookies())

	const getCachedUser = unstable_cache(fetchUser, [`user-${userId}-profile`], {
		revalidate: false,
	})
	const getCachedServices = unstable_cache(
		fetchUserServices,
		[`user-${userId}-services`],
		{ revalidate: false },
	)

	const [user, services] = await Promise.all([
		getCachedUser(),
		getCachedServices(),
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

							<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 py-6 lg:px-6 xl:px-8">
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
			redirect('/complete-profile')
		}
	}
}
