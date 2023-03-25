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

export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text)
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
