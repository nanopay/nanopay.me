import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthRedirect() {
	const router = useRouter()

	const { redirectTo } = router.query

	const isValidUrl = (url: string) => {
		try {
			new URL(url)
			return true
		} catch (e) {
			return false
		}
	}

	useEffect(() => {
		if (typeof redirectTo === 'string' && isValidUrl(redirectTo)) {
			router.push(redirectTo, undefined, {
				shallow: false,
			})
		} else {
			router.push('/home')
		}
	}, [redirectTo])

	return 'loading...'
}
