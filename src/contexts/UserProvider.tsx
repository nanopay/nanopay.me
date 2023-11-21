'use client'

import { User } from '@/types/users'
import React, { useContext, createContext } from 'react'
export interface UserProviderProps {
	user: User
	children: React.ReactNode
}

const UserContext = createContext({} as User)

export const UserProvider = ({ user, children }: UserProviderProps) => {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
	return useContext(UserContext)
}
