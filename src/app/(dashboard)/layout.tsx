import { Footer } from '@/components/Footer'
import Appbar from '@/components/Appbar'
import PopupAlert from '@/components/PopupAlert'
import { UserProvider } from '@/contexts/UserProvider'
import { getUserId } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PreferencesProvider from '@/contexts/PreferencesProvider'
import { unstable_cache } from 'next/cache'
import { User } from '@/services/client'
import { DEFAULT_AVATAR_URL } from '@/constants'
import { Client, Service } from '@/services/client'

export async function getCachedUser(userId: string): Promise<User> {
	const client = new Client(cookies())

	return unstable_cache(
		async () => {
			const data = await client.user.getProfile()

			if (!data) {
				throw new Error('profile not found')
			}

			return {
				id: data.id,
				name: data.name,
				email: data.email,
				avatar_url: data.avatar_url || DEFAULT_AVATAR_URL,
				created_at: data.created_at,
			}
		},
		[`user-${userId}-profile`],
		{
			revalidate: false,
			tags: [`user-${userId}-profile`],
		},
	)()
}

export async function getCachedUserServices(
	userId: string,
): Promise<Service[]> {
	const client = new Client(cookies())
	return unstable_cache(
		async () => {
			return await client.services.list()
		},
		[`user-${userId}-services`],
		{
			revalidate: false,
			tags: [`user-${userId}-services`],
		},
	)()
}

async function fetchData() {
	const userId = await getUserId(cookies())

	const [user, services] = await Promise.all([
		getCachedUser(userId),
		getCachedUserServices(userId),
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
