import {
	S3Client,
	DeleteObjectCommand,
	CopyObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export type S3Fields = Record<string, string>

const Bucket = process.env.S3_BUCKET as string

const client = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
})

const sanitizeKey = (key: string): string => {
	// remove prefix /
	return key.replace(/^\//, '')
}

export const uploadObject = async (
	file: File,
	presignedUrl: string,
	progressCallback?: (progress: number) => void,
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('PUT', presignedUrl, true)

		xhr.upload.onprogress = function (event) {
			if (progressCallback && event.lengthComputable) {
				const percentComplete = (event.loaded / event.total) * 100
				progressCallback(percentComplete)
			}
		}

		xhr.onload = function () {
			if (xhr.status === 200) {
				resolve()
			} else {
				reject('Error uploading file. Status: ' + xhr.status)
			}
		}

		xhr.onerror = function () {
			reject('Error uploading file. Check your network connection.')
		}

		xhr.send(file)
	})
}

export interface CreatePresignedProps {
	key: string
	size: number
	expires?: number
	type?: string
}

export const createPresignedUrl = async ({
	key,
	size,
	type,
}: CreatePresignedProps): Promise<string> => {
	const Key = sanitizeKey(key)

	const command = new PutObjectCommand({
		Bucket,
		Key,
		ACL: 'public-read',
		ContentLength: size,
		ContentType: type,
	})

	const url = await getSignedUrl(client, command, {
		expiresIn: 3600,
	})
	return url
}

export const putObject = async (key: string, file: File): Promise<void> => {
	const Key = sanitizeKey(key)
	const command = new PutObjectCommand({
		Bucket,
		Key,
		ACL: 'public-read',
		Body: file,
	})
	await client.send(command)
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
