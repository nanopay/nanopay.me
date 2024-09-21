import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseInfiniteQueryOptions {
	initialPage?: number
	pageSize?: number
	countTotal?: number
}

export interface UseInfiniteQueryResult<T> {
	data: T[]
	loading: boolean
	error: Error | null
	hasMore: boolean
	loadMore: () => Promise<void>
	refresh: () => void
}

export type FetchFunction<T> = (page: number, pageSize: number) => Promise<T[]>

export const useInfiniteQuery = <T>(
	fetchFunction: FetchFunction<T>,
	options: UseInfiniteQueryOptions = {},
): UseInfiniteQueryResult<T> => {
	const { initialPage = 1, pageSize = 10 } = options
	const [data, setData] = useState<T[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [page, setPage] = useState<number>(initialPage)
	const hasFetchedInitial = useRef(false)

	const loadMore = useCallback(async () => {
		if (loading || !hasMore) return

		setLoading(true)
		try {
			const newData = await fetchFunction(page, pageSize)
			if (newData.length > 0) {
				setData(prevData => [...prevData, ...newData])
			}
			if (newData.length < pageSize) {
				setHasMore(false)
			} else {
				setPage(prevPage => prevPage + 1)
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error('An error occurred'))
		} finally {
			setLoading(false)
		}
	}, [fetchFunction, page, pageSize, loading, hasMore])

	useEffect(() => {
		if (options.countTotal === undefined) return
		if (data.length >= options.countTotal) {
			setHasMore(false)
		}
	}, [data, options.countTotal])

	useEffect(() => {
		if (hasFetchedInitial.current) return
		hasFetchedInitial.current = true

		loadMore()
	}, [])

	const refresh = useCallback(() => {
		setData([])
		setPage(initialPage)
		setHasMore(true)
		setLoading(false)
		setError(null)
		loadMore()
	}, [initialPage])

	return { data, loading, error, hasMore, loadMore, refresh }
}
