import axios, { AxiosResponse } from 'axios'
import { S3Fields } from '../api/s3'
import {
	S3Client,
	DeleteObjectCommand,
	CopyObjectCommand,
} from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Conditions as ConditionsType } from '@aws-sdk/s3-presigned-post/dist-types/types'

const Bucket = process.env.S3_BUCKET as string
const Region = process.env.S3_REGION as string

const client = new S3Client({
	region: Region,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
})

const sanitizeKey = (key: string): string => {
	// remove prefix /
	return key.replace(/^\//, '')
}

export const uploadObject = async (
	file: File,
	fields: S3Fields,
	presignedUrl: string,
	progressCallback?: (progress: number) => void,
): Promise<AxiosResponse<void>> => {
	const formData = new FormData()
	Object.keys(fields).forEach(key => {
		formData.append(key, fields[key as keyof S3Fields])
	})
	formData.append('file', file)
	return axios.post(presignedUrl, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		onUploadProgress: progressEvent => {
			if (progressCallback && progressEvent.total) {
				const progress: number = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total,
				)
				progressCallback(progress)
			}
		},
	})
}

interface CreatePresignedProps {
	key: string
	minLength?: number
	maxLength?: number
	expires?: number
}

export const createPresigned = async ({
	key,
	minLength = 1,
	maxLength = 1024 * 1024 * 1024, // 1GB
	expires = 900, // 15 minutes
}: CreatePresignedProps): Promise<{ url: string; fields: S3Fields }> => {
	const Key = sanitizeKey(key)

	const Conditions: ConditionsType[] = [
		{ acl: 'public-read' },
		{ bucket: Bucket },
		['starts-with', '$key', Key],
		['content-length-range', minLength, maxLength],
	]

	const Fields = {
		acl: 'public-read',
	}

	const { url, fields } = await createPresignedPost(client, {
		Bucket,
		Key,
		Conditions,
		Fields,
		Expires: expires,
	})
	return { url, fields }
}

export const deleteObject = async (key: string): Promise<void> => {
	const Key = sanitizeKey(key)
	const command = new DeleteObjectCommand({
		Bucket,
		Key,
	})
	await client.send(command)
}

export const moveObject = async (
	key: string,
	newKey: string,
): Promise<void> => {
	const Key = sanitizeKey(key)
	const command = new CopyObjectCommand({
		Bucket,
		Key: newKey,
		CopySource: `${Bucket}/${Key}`,
	})
	await client.send(command)

	// Failed deletions should be fixed by a cron job or lifecycle policy
	try {
		await deleteObject(Key)
	} catch (e) {
		console.error(e)
	}
}

const s3 = {
	uploadObject,
	createPresigned,
	deleteObject,
	moveObject,
}

export default s3
