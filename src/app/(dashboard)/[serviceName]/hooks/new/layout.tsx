import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'New API Key',
}

export default function NewApiKeyLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
