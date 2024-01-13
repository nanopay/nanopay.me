/**
 *  An object that can be used to represent binary data.
 */
export type BytesLike = string | Uint8Array

export const HexCharacters: string = '0123456789abcdef'

export const isHexString = (value: string): boolean => {
	if (typeof value === 'string' && value.match(/^([0-9a-f][0-9a-f])*$/i)) {
		return true
	}
	return false
}

/**
 *  Get a typed Uint8Array for value. If already a Uint8Array
 *  the original value is returned;
 */
export const getBytes = (value: BytesLike): Uint8Array => {
	if (value instanceof Uint8Array) {
		return value
	}

	if (isHexString(value)) {
		const result = new Uint8Array(value.length / 2)
		let offset = 0
		for (let i = 0; i < result.length; i++) {
			result[i] = parseInt(value.substring(offset, offset + 2), 16)
			offset += 2
		}
		return result
	}

	throw new Error('invalid BytesLike value ' + value)
}

/**
 *  Returns a hex string representation of %%data%%.
 */
export function hexlify(data: BytesLike): string {
	const bytes = getBytes(data)

	let result = ''
	for (let i = 0; i < bytes.length; i++) {
		const v = bytes[i]
		result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]
	}
	return result
}

export const getURL = () => {
	let url =
		process.env.NEXT_PUBLIC_SITE_URL || // Set this to your site URL in production env.
		process.env.NEXT_PUBLIC_VERCEL_URL || // Automatically set by Vercel.
		'http://localhost:3000/'
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`
	// Make sure to including trailing `/`.
	url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
	return url
}

export const concatURL = (
	baseURL: string,
	paths: string | string[],
): string => {
	const pathsArray = Array.isArray(paths) ? paths : [paths]
	return new URL(pathsArray.join('/'), baseURL).toString()
}

export const sanitizeSlug = (name: string) => {
	// only allows lowercase letters, numbers, dashes, underscores and dots
	return name
		.slice(0, 40)
		.replace(/[^a-zA-Z0-9-_\.]/g, '')
		.toLowerCase()
}

export const checkUUID = (str: string) => {
	const regex = new RegExp(
		'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
		'gi',
	)
	return regex.test(str)
}
