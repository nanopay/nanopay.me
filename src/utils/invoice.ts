import crypto from 'crypto'
import { encodeBase32 } from '@/utils/base32'

export const generateInvoiceId = (): string => {
	const random = crypto.getRandomValues(new Uint8Array(5))
	const encoded = encodeBase32(random)
	return encoded.slice(0, 4) + '-' + encoded.slice(4, 8)
}
