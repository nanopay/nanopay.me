'use server'

import { cookies } from 'next/headers'
import { getUserId } from '@/utils/supabase/server'
import {
	ALLOWED_IMAGE_TYPES,
	MAX_IMAGE_SIZE,
	STATIC_ASSETS_URL,
} from '@/constants'
import { revalidateTag } from 'next/cache'
import { createPresignedUrl, moveObject } from '@/services/s3'
import { Client } from '@/services/client'

export interface UpdateUserProps {
	name: string
}

export const updateUser = async ({ name }: Partial<UpdateUserProps>) => {
	const userId = await getUserId(cookies())

	const client = new Client(cookies())

	await client.user.updateProfile({
		name,
	})

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
	const userId = await getUserId(cookies())

	const oldKey = `tmp/users/${userId}/avatar.png`
	const newKey = `users/${userId}/avatar.png`

	await moveObject(oldKey, newKey)

	const avatarUrl = new URL(STATIC_ASSETS_URL)
	avatarUrl.pathname = newKey
	avatarUrl.searchParams.set('v', Date.now().toString())

	const client = new Client(cookies())

	await client.user.updateProfile({
		avatar_url: avatarUrl.toString(),
	})

	revalidateTag(`user-${userId}`)
}
