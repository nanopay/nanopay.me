import axios, { AxiosResponse } from 'axios'
import { S3Fields } from '../api/s3'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Conditions as ConditionsType } from '@aws-sdk/s3-presigned-post/dist-types/types'

const Bucket = 'static.nanopay.me'

const client = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
})

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
	const Conditions: ConditionsType[] = [
		{ acl: 'public-read' },
		{ bucket: Bucket },
		['starts-with', '$key', key],
		['content-length-range', minLength, maxLength],
	]

	const Fields = {
		acl: 'public-read',
	}

	const { url, fields } = await createPresignedPost(client, {
		Bucket,
		Key: key,
		Conditions,
		Fields,
		Expires: expires,
	})
	return { url, fields }
}

export const deleteObject = async (Key: string): Promise<void> => {
	const command = new DeleteObjectCommand({
		Bucket,
		Key,
	})
	await client.send(command)
}

const s3 = {
	uploadObject,
	createPresigned,
	deleteObject,
}

export default s3
