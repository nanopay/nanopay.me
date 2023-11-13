import { UserProfile } from '@/types/users'
import { concatURL } from '@/utils/helpers'
import s3 from '@/services/s3'
import Fetcher, { FetcherOptions } from '@/lib/fetcher'

export const users = (fetcher: Fetcher) => {
	return {
		register: async (data: UserProfile, options?: FetcherOptions) => {
			return fetcher.post('/users/register', data, options)
		},
		upload: {
			avatar: async (
				file: File,
				progressCallback?: (progress: number) => void,
			): Promise<string> => {
				if (file.size > 1024 * 1024 * 5) {
					throw new Error('File size must be less than 5MB')
				}
				const { url, fields } = await fetcher.post('/upload/image')

				await s3.uploadObject(file, fields, url, progressCallback)
				return concatURL(
					`https://${process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST}`,
					fields.key,
				)
			},
		},
	}
}
