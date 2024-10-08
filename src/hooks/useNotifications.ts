import { useAction } from 'next-safe-action/hooks'
import { useInfiniteQuery } from './useInfiniteQuery'
import { useState } from 'react'
import { getNotifications as getNotificationsAction } from '@/app/(dashboard)/actions'

export const useNotifications = (
	serviceId: string,
	options?: {
		initialPage?: number
		pageSize?: number
		status: 'inbox' | 'archived'
	},
) => {
	const [count, setCount] = useState<number | null>(null)
	const { executeAsync: getNotifications } = useAction(getNotificationsAction)

	const initialPage = options?.initialPage || 1
	const pageSize = options?.pageSize || 10
	const status = options?.status || 'inbox'

	const { data, loading, error, hasMore, loadMore, refresh } = useInfiniteQuery(
		async (page, pageSize) => {
			const offset = (page - 1) * pageSize
			const result = await getNotifications({
				serviceId,
				options: {
					offset,
					limit: pageSize,
					status,
				},
			})
			if (!result?.data) return []
			setCount(result.data.count)
			return result.data.notifications
		},
		{ initialPage, pageSize, countTotal: count || undefined },
	)

	return { data, count, loading, error, hasMore, loadMore, refresh }
}
