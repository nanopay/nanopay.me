import { createPresigned } from '@/services/s3'
import { randomUUID } from 'crypto'

export default async function () {
	// Todo: Protect route

	const { url, fields } = await createPresigned({
		key: `tmp/${randomUUID()}.png`,
		minLength: 1024, // 1KB
		maxLength: 1024 * 1024 * 5, // 5MB
	})

	return Response.json({ url, fields })
}
