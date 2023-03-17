import { blake2bHex } from 'blakejs'
import { getBytes, hexlify, isHexString } from './helpers'
import crypto from 'crypto'

export const API_KEYS_SECRET_LENGTH = 64
export const API_KEY_BYTES_LENGTH = 16
export const API_KEY_CHECKSUM_BYTES_LENGTH = 4
const API_KEYS_SECRET = process.env.API_KEYS_SECRET

export const createApiKey = () => {
	if (
		!API_KEYS_SECRET ||
		!isHexString(API_KEYS_SECRET) ||
		API_KEYS_SECRET.length != API_KEYS_SECRET_LENGTH
	) {
		throw new Error('API_KEYS_SECRET is not set or is not a valid hex string')
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

export const verifyApiKey = (apiKey: string) => {
	if (
		!API_KEYS_SECRET ||
		!isHexString(API_KEYS_SECRET) ||
		API_KEYS_SECRET.length != API_KEYS_SECRET_LENGTH
	) {
		throw new Error('API_KEYS_SECRET is not set or is not a valid hex string')
	}

	if (!isHexString(apiKey)) {
		return false
	}

	if (
		apiKey.length !=
		API_KEY_BYTES_LENGTH * 2 + API_KEY_CHECKSUM_BYTES_LENGTH * 2
	) {
		return false
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

	return givenChecksum === computedChecksum
}
