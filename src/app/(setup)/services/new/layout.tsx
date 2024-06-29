import { getCachedUser } from '@/lib/cache/user'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'New Service',
	description: 'Create a new service in NanoPay',
}

export default async function NewServiceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getCachedUser()

	if (!user) {
		redirect('/complete-profile')
	}

	return children
}
