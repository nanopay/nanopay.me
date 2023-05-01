import Loading from '@/components/Loading'
import { UserProfile } from '@/types/users'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useToast } from '../hooks/useToast'

interface AuthContextValues {
	user: UserProfile
	signOut: () => Promise<{
		error: AuthError | null
	}>
}

interface AuthProviderProps {
	children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextValues)

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserProfile>()
	const [loading, setLoading] = useState(true)

	// const supabaseClient = useSupabaseClient<Database>()
	const supabaseUser = useUser()

	const { isLoading, error, supabaseClient } = useSessionContext()

	const { showError } = useToast()

	const router = useRouter()

	const loadUser = () => {
		const userProfile = supabaseUser?.user_metadata?.internal_profile || null
		setUser(userProfile)
	}

	useEffect(() => {
		if (!isLoading) {
			if (supabaseUser && router.pathname != '/login') {
				loadUser()
			}
			setLoading(false)
		}
	}, [supabaseUser, isLoading])

	useEffect(() => {
		if (error) {
			showError(error.name, error.message)
			router.push('/login')
		}
	}, [error])

	const signOut = () => supabaseClient.auth.signOut()

	return (
		<AuthContext.Provider
			value={{
				user: user as UserProfile,
				signOut,
			}}
		>
			{loading ? (
				<div className="w-full h-screen flex items-center justify-center">
					<Loading className="sm:w-32 sm:h-32" />
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
