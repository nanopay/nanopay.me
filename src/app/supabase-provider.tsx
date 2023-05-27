'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
	createBrowserSupabaseClient,
	Session,
} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'
import { UserProfile } from '@/types/users'

interface SupabaseProviderValues {
	supabase: ReturnType<typeof createBrowserSupabaseClient<Database>>
	session: Session | null
	user: UserProfile | null
}

const Context = createContext({} as SupabaseProviderValues)

export default function SupabaseProvider({
	children,
	session,
}: {
	children: React.ReactNode
	session: Session | null
}) {
	const router = useRouter()

	const [supabase] = useState(() => createBrowserSupabaseClient<Database>())
	const user = session?.user?.user_metadata?.internal_profile

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			router.refresh()
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [router, supabase])

	return (
		<Context.Provider value={{ supabase, session, user }}>
			<>{children}</>
		</Context.Provider>
	)
}

export const useSupabase = () => {
	const context = useContext(Context)

	if (context === undefined) {
		throw new Error('useSupabase must be used inside SupabaseProvider')
	}

	return context
}
