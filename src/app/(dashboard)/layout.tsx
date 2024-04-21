import { Footer } from '@/components/Footer'
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
import { DEFAULT_AVATAR_URL } from '@/constants'

export async function fetchUser(
	cookieStore: ReturnType<typeof cookies>,
): Promise<User> {
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase.from('profiles').select('*').single()

	if (error && error.code !== 'PGRST116') {
		throw new Error(error.message)
	}

	if (!data) {
		throw new Error('profile not found')
	}

	return {
		id: data.user_id,
		name: data.name,
		email: data.email,
		avatar_url: data.avatar_url || DEFAULT_AVATAR_URL,
	}
}

export async function fetchUserServices(
	cookieStore: ReturnType<typeof cookies>,
): Promise<Service[]> {
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase.from('services').select('*')

	if (error) {
		throw new Error(error.message)
	}

	return data || []
}

async function fetchData() {
	const cookieStore = cookies()
	const userId = await getUserId(cookieStore)

	const getCachedUser = unstable_cache(fetchUser, [`user-${userId}-profile`], {
		revalidate: false,
		tags: [`user-${userId}-profile`],
	})

	const getCachedServices = unstable_cache(
		fetchUserServices,
		[`user-${userId}-services`],
		{
			revalidate: false,
			tags: [`user-${userId}-services`],
		},
	)

	const [user, services] = await Promise.all([
		getCachedUser(cookieStore),
		getCachedServices(cookieStore),
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
	} catch (error) {
		if (error instanceof Error && error.message === 'profile not found') {
			redirect('/complete-profile')
		}
		throw error
	}
}
