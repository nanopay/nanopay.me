'use client'

import { User } from '@/core/client'
import React, { useContext, createContext } from 'react'
export interface UserProviderProps {
	user: User
	children: React.ReactNode
}

const UserContext = createContext({} as User)

export const UserProvider = ({ user, children }: UserProviderProps) => {
	return <UserContext value={user}>{children}</UserContext>;
}

export const useUser = () => {
	return useContext(UserContext)
}
