// TODO: some of this constants is not part of core, move them

import { getSiteUrl } from '../utils/url'

export const SITE_URL = getSiteUrl()

export const BASE_API_URL = process.env.CUSTOM_API_DOMAIN
	? `https://${process.env.CUSTOM_API_DOMAIN}`
	: `${SITE_URL}/api`

export const CONTACT_EMAIL = 'hello@nanopay.me'
export const SUPPORT_EMAIL = 'support@nanopay.me'
export const REFUND_EMAIL = 'refund@nanopay.me'

export const INVOICE_MINIMUM_PRICE = 0.0001 // 0.0001 NANO
export const INVOICE_MAX_PRICE = 1000000 // 1 million NANO
export const MAX_PAYMENTS_PER_INVOICE = 10

export const STATIC_ASSETS_URL = process.env.NEXT_PUBLIC_STATIC_ASSETS_URL!

export const DEFAULT_AVATAR_URL = 'https://static.nanopay.me/images/user.png'
export const MAX_IMAGE_SIZE = 1024 * 1024 * 4 // 4 MB

export const MAX_URL_LENGTH = 256
export const MAX_EMAIL_LENGTH = 128

export const MIN_USER_NAME_LENGTH = 3
export const MAX_USER_NAME_LENGTH = 64

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 64

export const MIN_SERVICE_NAME_LENGTH = 3
export const MAX_SERVICE_NAME_LENGTH = 32

export const MAX_SLUG_LENGTH = 48

export const DEFAULT_INVOICES_PAGINATION_LIMIT = 10

export const AUTO_REDIRECT_DELAY = 5000

export const MIN_SPONSOR_AMOUNT = 10
export const SPONSOR_RECIPIENT_ADDRESS =
	'nano_3dqh8z8ncswmf7151gryu7mqpwbw4f68hi7d8g433omtuabfi438etyyp9ik'

export const DONATE_URL =
	'https://github.com/nanopay/nanopay.me?tab=readme-ov-file#donate-%D3%BF'

export const GITHUB_URL = 'https://github.com/nanopay/nanopay.me'
export const X_URL = 'https://x.com/nanopay_me'
