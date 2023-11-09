'use client'

import Loading from '@/components/Loading'
import { User } from '@/types/users'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { AuthResponse } from '@supabase/supabase-js'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useState, useEffect, createContext } from 'react'
import { useToast } from '../hooks/useToast'
import { Database } from '@/types/supabase'
import { DEFAULT_AVATAR_URL } from '@/constants'

export interface AuthContextValues {
	user: User
	signOut: () => Promise<void>
	retrieveUser: () => Promise<void>
	refreshSession: () => Promise<AuthResponse>
}

export interface AuthProviderProps {
	children: React.ReactNode
}

const AuthContext = createContext({} as AuthContextValues)

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const supabase = createClientComponentClient<Database>()

	const { showError } = useToast()

	const router = useRouter()

	const pathname = usePathname()

	const retrieveUser = async () => {
		const { data, error } = await supabase.from('profiles').select('*').single()

		if (error && error.code !== 'PGRST116') {
			throw new Error(error.message)
		}

		if (!data) {
			// User has been deleted
			await refreshSession()
			return
		}

		setUser({
			id: data.user_id,
			name: data.name,
			email: data.email,
			avatar_url: data.avatar_url || DEFAULT_AVATAR_URL,
		})
	}

	const initUserRetrieve = async () => {
		try {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()
			console.log('data', session)
			if (error) {
				alert('here')
				showError(error.message)
				return
			}
			const user = session?.user
			if (user?.email) {
				setUser({
					id: user.id,
					email: user.email,
					name: '',
					avatar_url: DEFAULT_AVATAR_URL,
				})
				if (pathname !== '/register') {
					await retrieveUser()
				}
			}
		} catch (error) {
			showError(error instanceof Error ? error.message : JSON.stringify(error))
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		initUserRetrieve()
	}, [])

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN') {
				initUserRetrieve()
			}
			if (event === 'SIGNED_OUT') {
				setUser(null)
			}
		})

		return () => {
			subscription.unsubscribe()
		}
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

	if (isLoading && pathname !== '/' && pathname !== '/login') {
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
