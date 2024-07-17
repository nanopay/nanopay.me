import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { Client, User } from '@/core/client'
import { getUserId } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

export async function getCachedUser(): Promise<User | null> {
	const userId = await getUserId(cookies())
	const client = new Client(cookies())

	return unstable_cache(
		async () => {
			const data = await client.user.getProfile()

			if (!data) {
				return null
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
