'use server'

import { cookies } from 'next/headers'
import { createClient, getUserId } from '@/utils/supabase/server'
import {
	ALLOWED_IMAGE_TYPES,
	MAX_IMAGE_SIZE,
	STATIC_ASSETS_HOST,
} from '@/constants'
import { revalidateTag } from 'next/cache'
import { createPresignedUrl, moveObject } from '@/services/s3'
import { concatURL } from '@/utils/helpers'

export interface UpdateUserProps {
	name: string
}

export const updateUser = async ({ name }: Partial<UpdateUserProps>) => {
	const supabase = createClient(cookies())

	const userId = await getUserId(cookies())

	const { error: createError } = await supabase
		.from('profiles')
		.update({
			name,
		})
		.eq('user_id', userId)

	if (createError) {
		throw new Error(createError.message)
	}

	revalidateTag(`user-${userId}`)
}

export const createAvatarUploadPresignedUrl = async ({
	type,
	size,
}: {
	type: string
	size: number
}) => {
	const userId = await getUserId(cookies())

	if (!ALLOWED_IMAGE_TYPES.includes(type)) {
		throw new Error('Invalid file type')
	}

	if (size < 32) {
		throw new Error('Image too small')
	}

	if (size > MAX_IMAGE_SIZE) {
		throw new Error('Image too large')
	}

	const key = `tmp/users/${userId}/avatar.png`

	const url = await createPresignedUrl({
		key,
		type,
		size,
	})

	return url
}

export const updateAvatar = async () => {
	const supabase = createClient(cookies())

	const userId = await getUserId(cookies())

	const oldKey = `tmp/users/${userId}/avatar.png`
	const newKey = `users/${userId}/avatar.png`

	await moveObject(oldKey, newKey)

	const url =
		concatURL(`https://${STATIC_ASSETS_HOST}`, newKey) + `?v=${Date.now()}`

	const { error } = await supabase
		.from('profiles')
		.update({
			avatar_url: url,
		})
		.eq('user_id', userId)

	if (error) {
		throw new Error(error.message)
	}

	revalidateTag(`user-${userId}`)
}
