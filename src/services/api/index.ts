import { services } from './services'
import { invoices } from './invoices'
import Fetcher from '@/lib/fetcher'

const fetcher = new Fetcher(process.env.NEXT_PUBLIC_API_URL!!)

const getErrorMessage = (error: any): string | null => {
	return error.message
}

const api = {
	client: fetcher,
	services: services(fetcher),
	invoices: invoices(fetcher),
	getErrorMessage,
}

export default api
