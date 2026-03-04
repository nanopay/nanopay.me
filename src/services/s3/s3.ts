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

const normalizePutBody = async (
	file: File | string | Uint8Array | Buffer | Readable,
): Promise<{
	body: File | string | Uint8Array | Buffer | Readable
	contentLength?: number
}> => {
	// Cloudflare Workers + AWS SDK can fail hashing multipart File streams.
	// Avatar uploads are capped at 4 MB, so buffering them in memory is acceptable.
	if (file instanceof File) {
		const bytes = new Uint8Array(await file.arrayBuffer())
		return {
			body: bytes,
			contentLength: bytes.byteLength,
		}
	}

	if (typeof file === 'string') {
		return {
			body: file,
			contentLength: new TextEncoder().encode(file).byteLength,
		}
	}

	if (file instanceof Uint8Array || file instanceof Buffer) {
		return {
			body: file,
			contentLength: file.byteLength,
		}
	}

	return { body: file }
}

export const putObject = async (
	key: string,
	file: File | string | Uint8Array | Buffer | Readable,
	ContentType?: string,
): Promise<void> => {
	const Key = sanitizeKey(key)
	const { body, contentLength } = await normalizePutBody(file)
	const command = new PutObjectCommand({
		Bucket,
		Key,
		ACL: 'public-read',
		Body: body,
		ContentType,
		ContentLength: contentLength,
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
