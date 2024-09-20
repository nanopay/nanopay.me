import { useEffect, useState } from 'react'

export const calculateTimeAgo = (date: Date | string | number) => {
	const now = new Date()
	const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
	let interval = Math.floor(seconds / 31536000)

	if (interval >= 1) {
		return interval === 1 ? '1 year ago' : `${interval} years ago`
	}
	interval = Math.floor(seconds / 2592000)
	if (interval >= 1) {
		return interval === 1 ? '1 month ago' : `${interval} months ago`
	}
	interval = Math.floor(seconds / 86400)
	if (interval >= 1) {
		return interval === 1 ? '1 day ago' : `${interval} days ago`
	}
	interval = Math.floor(seconds / 3600)
	if (interval >= 1) {
		return interval === 1 ? '1 hour ago' : `${interval} hours ago`
	}
	interval = Math.floor(seconds / 60)
	if (interval >= 1) {
		return interval === 1 ? '1 minute ago' : `${interval} minutes ago`
	}
	return 'just now'
}

export function TimeAgo({
	dateTime,
	...props
}: React.HTMLAttributes<HTMLTimeElement> & { dateTime: string | Date }) {
	const [timeAgo, setTimeAgo] = useState('')

	// Update the time ago every minute
	useEffect(() => {
		const updateTimeAgo = () => setTimeAgo(calculateTimeAgo(dateTime))
		updateTimeAgo()
		const interval = setInterval(updateTimeAgo, 60000)
		return () => clearInterval(interval)
	}, [dateTime])

	return (
		<time dateTime={new Date(dateTime).toISOString()} {...props}>
			{timeAgo}
		</time>
	)
}
