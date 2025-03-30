import { useEffect, useState } from 'react'

export const useExpiration = (
	expiredAt: number | string | Date,
	onExpired?: () => void,
): boolean => {
	const expirationDate = new Date(expiredAt)
	const [isExpired, setIsExpired] = useState(new Date() >= expirationDate)

	useEffect(() => {
		if (isExpired) {
			if (onExpired) queueMicrotask(() => onExpired())
			return
		}

		const timeLeft = expirationDate.getTime() - new Date().getTime()
		const timeout = setTimeout(() => {
			setIsExpired(true)
			if (onExpired) onExpired()
		}, timeLeft)

		return () => clearTimeout(timeout)
	}, [expiredAt, onExpired])

	return isExpired
}
