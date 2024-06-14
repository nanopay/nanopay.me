'use client'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

export default function ClientContexts({ children }: { children: ReactNode }) {
	return (
		<>
			{children}
			<ToastContainer />
		</>
	)
}
