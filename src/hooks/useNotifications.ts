import { useAction } from 'next-safe-action/hooks'
import { useInfiniteQuery } from './useInfiniteQuery'
import { useState } from 'react'
import { getNotifications } from '@/app/(dashboard)/actions'

export const useNotifications = (serviceId: string) => {
	const [count, setCount] = useState<number | null>(null)
	const { executeAsync } = useAction(getNotifications)

	const initialPage = 1
	const pageSize = 10

	const { data, loading, error, hasMore, loadMore } = useInfiniteQuery(
		async (page, pageSize) => {
			const offset = (page - 1) * pageSize
			const result = await executeAsync({
				serviceId,
				options: {
					offset,
					limit: pageSize,
				},
			})
			if (!result?.data) return []
			setCount(result.data.count)
			return result.data.notifications
		},
		{ initialPage, pageSize, countTotal: count || undefined },
	)

	return { data, count, loading, error, hasMore, loadMore }
}
