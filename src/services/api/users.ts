import { User } from '@/types/users'
import Fetcher, { FetcherOptions } from '@/lib/fetcher'

export const users = (fetcher: Fetcher) => {
	return {
		retrieve: (options?: FetcherOptions): Promise<User> => {
			return fetcher.get('/user', null, options)
		},
	}
}
