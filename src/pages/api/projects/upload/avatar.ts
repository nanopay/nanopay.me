import { createPresigned } from '@/services/s3'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { url, fields } = await createPresigned({
		key: `projects/${req.body.id}/tmp/avatar.png`,
		minLength: 1024, // 1KB
		maxLength: 1024 * 1024 * 5, // 5MB
	})

	return res.status(200).json({ url, fields })
}
