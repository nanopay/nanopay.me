import { MAX_SLUG_LENGTH } from '@/core/constants'

export const slugify = (text: string) => {
	return text
		.normalize('NFD') // Normalize diacritics (accents).
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents).
		.replace(/[_\.\s]+/g, '-') // Replace spaces, dots and underscores with dashes.
		.replace(/[^a-zA-Z0-9-]/g, '') // Ensure only alphanumeric characters and dashes.
		.replace(/-+$/g, '') // Remove trailing dashes.
		.slice(0, MAX_SLUG_LENGTH) // Limit the length of the slug.
		.toLowerCase() // Lowercase the slug.
}
