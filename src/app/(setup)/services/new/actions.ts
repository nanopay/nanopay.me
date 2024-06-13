'use server'

import {
	ALLOWED_IMAGE_TYPES,
	MAX_IMAGE_SIZE,
	STATIC_ASSETS_HOST,
} from '@/constants'
import { createPresignedUrl, moveObject } from '@/services/s3'
import { ServiceCreate } from '@/types/services'
import { checkUUID } from '@/utils/helpers'
import { createClient, getUserId } from '@/utils/supabase/server'
import { UUID, randomUUID } from 'crypto'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const createService = async ({
	name,
	avatar_url,
	description,
}: ServiceCreate): Promise<UUID> => {
	const userId = await getUserId(cookies())

	const supabase = createClient(cookies())

	const serviceId = randomUUID()

	if (avatar_url) {
		avatar_url = await moveAvatar(avatar_url, userId, serviceId)
	}

	const { error } = await supabase.from('services').insert({
		id: serviceId,
		user_id: userId,
		name,
		display_name: name,
		avatar_url: avatar_url,
		description,
	})

	if (error) {
		throw new Error(error.message)
	}

	revalidateTag(`user-${userId}-services`)

	redirect(`/${name}?new=true`)
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

	const uuid = randomUUID()

	const key = `tmp/users/${userId}/${uuid}.${type.split('/')[1]}`

	const uploadUrl = await createPresignedUrl({
		key,
		type,
		size,
	})

	const getUrl = new URL(STATIC_ASSETS_HOST)
	getUrl.pathname = key

	return {
		uploadUrl,
		getUrl: getUrl.toString(),
	}
}

const moveAvatar = async (
	avatarUrl: string,
	userId: string,
	serviceId: string,
) => {
	const filename = avatarUrl.split('/').pop()
	const uuid = filename?.split('.')[0]
	const type = filename?.split('.')[1]
	if (!uuid || !checkUUID(uuid)) {
		throw new Error('Invalid avatar URL')
	}
	try {
		await moveObject(
			`tmp/users/${userId}/${uuid}.${type}`,
			`services/${serviceId}/avatar.${type}`,
		)
	} catch (error) {
		console.error(error)
		throw new Error('failed moving avatar')
	}

	const newUrl = new URL(STATIC_ASSETS_HOST)
	newUrl.pathname = `/services/${serviceId}/avatar.${type}`

	return newUrl.toString()
}
