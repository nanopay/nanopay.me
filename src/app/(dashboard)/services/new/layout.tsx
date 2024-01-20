import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'New Service',
	description: 'Create a new service in NanoPay',
}

export default function NewServiceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
