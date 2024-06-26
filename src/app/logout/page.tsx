import { headers } from 'next/headers'
import { LogoutCard } from './logout-card'

export default async function Logout() {
	const headersList = headers()
	const referer = headersList.get('referer')
	return <LogoutCard hasPrevious={!!referer} />
}
