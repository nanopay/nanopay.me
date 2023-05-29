import Loading from '@/components/Loading'
import { User } from '@/types/users'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { AuthResponse } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useToast } from '../hooks/useToast'

interface AuthContextValues {
	user: User
	signOut: () => Promise<void>
	retrieveUser: () => Promise<void>
	refreshSession: () => Promise<AuthResponse>
}

interface AuthProviderProps {
	children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextValues)

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User>()
	const [loading, setLoading] = useState(true)
	const [sessionRefreshed, setSessionRefreshed] = useState(false)

	const supabaseUser = useUser()

	const { isLoading, error, supabaseClient } = useSessionContext()

	const { showError } = useToast()

	const router = useRouter()

	const retrieveUser = async () => {
		const { data, error } = await supabaseClient.from('profiles').select('*')

		if (error) {
			await router.push('/500')
			throw new Error(error.message)
		}

		if (!data || data.length === 0) {
			/*
			 * It can mean 2 things:
			 * 1. User did not complete the registration
			 * 2. User has been deleted
			 */

			if (!sessionRefreshed) {
				// Refresh the token
				setSessionRefreshed(true)
				const { error } = await refreshSession()
				if (error) {
					await signOut()
					throw new Error('Cannot refresh session')
				}
			} else {
				// Redirect to register
				setSessionRefreshed(false)
				await router.push('/register')
				return
			}
		}

		setUser({
			id: data[0].user_id,
			name: data[0].name,
			email: data[0].email,
			avatar_url: data[0].avatar_url,
		})
	}

	const handleUserLoading = async () => {
		if (!isLoading) {
			if (
				router.pathname !== '/login' &&
				router.pathname !== '/register' &&
				supabaseUser
			) {
				try {
					await retrieveUser()
					setLoading(false)
				} catch (error: any) {
					showError(error.message)
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

	const refreshSession = () => supabaseClient.auth.refreshSession()

	const signOut = async () => {
		const { error } = await supabaseClient.auth.signOut()
		if (error) {
			showError(error.name, error.message)
			throw error
		}
		await router.push('/login')
	}

	if (loading && router.pathname !== '/' && router.pathname !== '/login') {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Loading className="sm:w-32 sm:h-32" />
			</div>
		)
	}

	return (
		<AuthContext.Provider
			value={{
				user: user as User,
				signOut,
				retrieveUser,
				refreshSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}
