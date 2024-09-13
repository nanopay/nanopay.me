// Remove decimals without rounding
export const toFixedSafe = (num: number | string, fixed: number): string => {
	const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
	const match = num.toString().match(re)
	if (!match) throw new Error('toFixedSafe: invalid number')
	return match[0]
}

export const truncateAddress = (address: string) => {
	return `${address.slice(0, 10)}...${address.slice(-8)}`
}

export const toFiatCurrency = (amount: number, decimals = 2) => {
	const fixed = toFixedSafe(amount, decimals)
	const unity = fixed.split('.')[0]
	const decimal = fixed.split('.')[1] || ''
	return `${unity},${decimal.padEnd(2, '0')}`
}

export const formatDate = (date: string | number) => {
	const d = new Date(date)
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

export const formatTime = (date: string | number) => {
	const d = new Date(date)
	return new Date(date).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	})
}

export const formatDateTime = (date: string | number) => {
	const d = new Date(date)
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	})
}

export const explorerUrl = (hash: string) => {
	return `https://blocklattice.io/block/${hash}`
}

export const safeDecimalAdd = (...numbers: number[]): number => {
	// Find the maximum number of decimal places
	const maxDecimalPlaces = Math.max(
		...numbers.map(n => {
			const decimals = n.toString().split('.')[1]
			return decimals ? decimals.length : 0
		}),
	)

	// Multiply each number by 10^maxDecimalPlaces to convert to integers
	const factor = Math.pow(10, maxDecimalPlaces)
	const intSum = numbers.reduce((sum, n) => sum + Math.round(n * factor), 0)

	// Divide the result by 10^maxDecimalPlaces to get back to a decimal
	return intSum / factor
}
