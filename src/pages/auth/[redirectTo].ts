import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthRedirect() {
	const router = useRouter()

	const { redirectTo } = router.query

	useEffect(() => {
		if (typeof redirectTo === 'string' && redirectTo) {
			router.push(redirectTo, undefined, {
				shallow: false,
			})
		} else {
			router.push('/500')
		}
	}, [redirectTo])

	return 'loading...'
}
