import {
	S3Client,
	DeleteObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

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

export const putObject = async (
	key: string,
	file: File | string | Uint8Array | Buffer | Readable,
	ContentType?: string,
): Promise<void> => {
	const Key = sanitizeKey(key)
	const command = new PutObjectCommand({
		Bucket,
		Key,
		ACL: 'public-read',
		Body: file,
		ContentType,
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
