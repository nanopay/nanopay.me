import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'New Webhook',
}

export default function NewApiKeyLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
