import { getSiteUrl } from '../utils/url'

export const SITE_URL = getSiteUrl()

export const CONTACT_EMAIL = 'hello@nanopay.me'
export const SUPPORT_EMAIL = 'support@nanopay.me'
export const REFUND_EMAIL = 'refund@nanopay.me'

export const INVOICE_MINIMUM_PRICE = 0.0001 // 0.0001 NANO
export const INVOICE_MAX_PRICE = 1000000 // 1 million NANO

export const STATIC_ASSETS_URL = process.env.NEXT_PUBLIC_STATIC_ASSETS_URL!

export const DEFAULT_AVATAR_URL = 'https://static.nanopay.me/images/user.png'
export const MAX_IMAGE_SIZE = 1024 * 1024 * 4 // 4 MB

export const MAX_URL_LENGTH = 256
export const MAX_EMAIL_LENGTH = 128

export const MIN_USER_NAME_LENGTH = 3
export const MAX_USER_NAME_LENGTH = 64

export const MIN_SERVICE_NAME_LENGTH = 3
export const MAX_SERVICE_NAME_LENGTH = 32
