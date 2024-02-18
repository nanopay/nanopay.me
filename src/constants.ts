import { getSiteUrl } from './utils/url'

export const SITE_URL = getSiteUrl()

export const CONTACT_EMAIL = 'hello@nanopay.me'
export const SUPPORT_EMAIL = 'support@nanopay.me'
export const REFUND_EMAIL = 'refund@nanopay.me'

export const INVOICE_MINIMUM_PRICE = 0.0001
export const MAX_HOOKS = 5

export const STATIC_ASSETS_HOST = process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST!

export const DEFAULT_AVATAR_URL = 'https://static.nanopay.me/images/user.png'
export const MAX_IMAGE_SIZE = 1024 * 1024 * 8 // 8 MB
export const ALLOWED_IMAGE_TYPES = ['image/png']
