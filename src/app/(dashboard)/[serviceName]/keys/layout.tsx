import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'API Keys',
}

export default function ApiKeysLayout({ children }: { children: ReactNode }) {
	return children
}
