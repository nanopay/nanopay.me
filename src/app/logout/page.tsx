import { headers } from 'next/headers'
import { LogoutCard } from './logout-card'

export default async function Logout() {
	const headersList = await headers()
	const referer = headersList.get('referer')
	return <LogoutCard hasPrevious={!!referer} />
}
