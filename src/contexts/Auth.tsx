import Loading from '@/components/Loading'
import { UserProfile } from '@/types/users'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useToast } from '../hooks/useToast'

interface AuthContextValues {
	user: UserProfile
	signOut: () => Promise<void>
}

interface AuthProviderProps {
	children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextValues)

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserProfile>()
	const [loading, setLoading] = useState(true)

	const supabaseUser = useUser()

	const { isLoading, error, supabaseClient, session } = useSessionContext()

	const { showError } = useToast()

	const router = useRouter()

	const retrieveUserProfile = async () => {
		const { data, error } = await supabaseClient.from('profiles').select('*')

		if (error) {
			await router.push('/500')
			throw new Error(error.message)
		}

		if (!data || data.length === 0) {
			await router.push('/register')
			throw new Error('Cannot retrieve user profile')
		}

		setUser({
			name: data[0].name,
			email: data[0].email,
			avatar_url: data[0].avatar_url,
		})
	}

	const handleUserLoading = async () => {
		if (!isLoading) {
			if (router.pathname !== '/login' && router.pathname !== '/register') {
				if (supabaseUser) {
					try {
						await retrieveUserProfile()
						setLoading(false)
					} catch (error: any) {
						showError(error.message)
						setLoading(false)
					}
				} else if (!supabaseUser && session) {
					await signOut()
					setLoading(false)
				} else {
					await router.push('/login')
					setLoading(false)
				}
			} else {
				setLoading(false)
			}
		}
	}

	useEffect(() => {
		handleUserLoading()
	}, [supabaseUser, isLoading])

	useEffect(() => {
		if (error) {
			showError(error.name, error.message)
			router.push('/login').then(res => setLoading(false))
		}
	}, [error])

	const signOut = async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (error) {
			showError(error.name, error.message)
			throw error
		}
		await router.push('/login')
	}

	if (loading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Loading className="sm:w-32 sm:h-32" />
			</div>
		)
	}

	return (
		<AuthContext.Provider
			value={{
				user: user as UserProfile,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
