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
