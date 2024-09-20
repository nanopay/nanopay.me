import { cn } from '@/lib/cn'
import React, { useRef, useEffect, ReactNode } from 'react'

export interface InfiniteScrollProps
	extends React.HTMLAttributes<HTMLDivElement> {
	loadMore: () => void
	hasMore: boolean
	loader?: ReactNode
	endMessage?: ReactNode
	children: ReactNode
	scrollThreshold?: number
}

export function InfiniteScroll({
	loadMore,
	hasMore,
	loader = null,
	endMessage = null,
	children,
	scrollThreshold = 0.8,
	...props
}: InfiniteScrollProps) {
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const scrollContainer = scrollRef.current
		if (!scrollContainer) return

		const handleScroll = () => {
			if (!hasMore) return

			const { scrollTop, scrollHeight, clientHeight } = scrollContainer
			if (scrollTop + clientHeight >= scrollHeight * scrollThreshold) {
				loadMore()
			}
		}

		scrollContainer.addEventListener('scroll', handleScroll)
		return () => scrollContainer.removeEventListener('scroll', handleScroll)
	}, [hasMore, loadMore, scrollThreshold])

	return (
		<div
			ref={scrollRef}
			{...props}
			className={cn('h-full overflow-auto', props.className)}
		>
			{children}
			{hasMore ? loader : endMessage}
		</div>
	)
}
