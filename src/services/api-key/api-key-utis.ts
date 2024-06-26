import { blake2bHex } from 'blakejs'
import { getBytes, hexlify, isHexString } from './api-key-helpers'

import {
	API_KEYS_SECRET,
	API_KEYS_SECRET_LENGTH,
	API_KEY_BYTES_LENGTH,
	API_KEY_CHECKSUM_BYTES_LENGTH,
} from './api-key-constants'

export const generateApiKey = () => {
	if (
		!API_KEYS_SECRET ||
		!isHexString(API_KEYS_SECRET) ||
		API_KEYS_SECRET.length != API_KEYS_SECRET_LENGTH
	) {
		throw new Error('API_KEYS_SECRET is not set or is not a valid')
	}

	const randomBytes = crypto.getRandomValues(
		new Uint8Array(API_KEY_BYTES_LENGTH),
	)

	const secretKeyBytes = getBytes(API_KEYS_SECRET)

	const checksum = blake2bHex(
		randomBytes,
		secretKeyBytes,
		API_KEY_CHECKSUM_BYTES_LENGTH,
	)

	const apiKey = hexlify(randomBytes) + checksum

	return { apiKey, checksum }
}

export const verifyApiKeyWithChecksum = (
	apiKey: string,
): { isValid: true; checksum: string } | { isValid: false; checksum: null } => {
	if (
		!API_KEYS_SECRET ||
		!isHexString(API_KEYS_SECRET) ||
		API_KEYS_SECRET.length != API_KEYS_SECRET_LENGTH
	) {
		throw new Error('API_KEYS_SECRET is not set or is not a valid hex string')
	}

	if (!isHexString(apiKey)) {
		return { isValid: false, checksum: null }
	}

	if (
		apiKey.length !=
		API_KEY_BYTES_LENGTH * 2 + API_KEY_CHECKSUM_BYTES_LENGTH * 2
	) {
		return { isValid: false, checksum: null }
	}

	const randomBytes = getBytes(
		apiKey.slice(0, -API_KEY_CHECKSUM_BYTES_LENGTH * 2),
	)

	const givenChecksum = apiKey.slice(-API_KEY_CHECKSUM_BYTES_LENGTH * 2)

	const secretKeyBytes = getBytes(API_KEYS_SECRET)

	const computedChecksum = blake2bHex(
		randomBytes,
		secretKeyBytes,
		API_KEY_CHECKSUM_BYTES_LENGTH,
	)

	if (givenChecksum !== computedChecksum) {
		return { isValid: false, checksum: null }
	}

	return { checksum: computedChecksum, isValid: true }
}
