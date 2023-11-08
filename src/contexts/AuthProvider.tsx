import Loading from '@/components/Loading'
import { User } from '@/types/users'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { AuthResponse } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useToast } from '../hooks/useToast'
import { Database } from '@/types/supabase'

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

	const supabase = createClientComponentClient<Database>()

	const { showError } = useToast()

	const router = useRouter()

	const pathname = usePathname()

	const retrieveUser = async () => {
		const { data, error } = await supabase.from('profiles').select('*').single()

		if (error) {
			await router.push('/500')
			throw new Error(error.message)
		}

		if (!data) {
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
			id: data.user_id,
			name: data.name,
			email: data.email,
			avatar_url: data.avatar_url,
		})
	}

	const handleUserLoading = async () => {
		const { data, error } = await supabase.auth.getUser()
		if (error) {
			showError(error.message)
		}
		if (data.user?.email) {
			setUser({
				id: data.user.id,
				email: data.user.email,
				name: '',
				avatar_url: null,
			})
			if (pathname !== '/login' && pathname !== '/register') {
				try {
					if (data.user) {
						await retrieveUser()
					}
				} catch (error: any) {
					showError(error.message)
				} finally {
					setLoading(false)
				}
			}
		}
		setLoading(false)
	}

	useEffect(() => {
		handleUserLoading()
	}, [])

	const refreshSession = () => supabase.auth.refreshSession()

	const signOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			showError(error.name, error.message)
			throw error
		}
		await router.push('/login')
	}

	if (loading && pathname !== '/' && pathname !== '/login') {
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
