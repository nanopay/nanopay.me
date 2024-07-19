import { MAX_SLUG_LENGTH } from '@/core/constants'

export const slugify = (str: string): string => {
	return str
		.normalize('NFD') // Normalize diacritics (accents).
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents).
		.replace(/[_\.\s]+/g, '-') // Replace spaces, dots and underscores with dashes.
		.replace(/[^a-zA-Z0-9-]/g, '') // Ensure only alphanumeric characters and dashes.
		.replace(/-+$/g, '') // Remove trailing dashes.
		.slice(0, MAX_SLUG_LENGTH) // Limit the length of the slug.
		.toLowerCase() // Lowercase the slug.
}

export const checkUUID = (str: string): boolean => {
	const regex = new RegExp(
		'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
		'gi',
	)
	return regex.test(str)
}
