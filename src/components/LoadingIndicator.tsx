'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useOptimistic } from 'react'
import NProgress from 'nprogress'

export function LoadingIndicator() {
	const router = useRouter()
	const [loading, setLoading] = useOptimistic(false)

	useEffect(() => {
		NProgress.configure({ showSpinner: false })
		if (router.push.name === 'patched') return
		const push = router.push
		router.push = function patched(...args) {
			setLoading(true)
			push.apply(history, args)
		}
	}, [router])

	useEffect(() => {
		if (loading) {
			NProgress.start()
		}
		return () => {
			NProgress.done()
		}
	}, [loading])

	return null
}
