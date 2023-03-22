import axios from 'axios'
import { projects } from './projects'
import { users } from './users'
import { invoices } from './invoices'

export const axiosInstance = axios.create({
	baseURL: '/api',
})

const getErrorMessage = (error: any): string => {
	const message = error.response?.data?.message
	if (message && typeof message === 'string') return message
	return error.message || 'Unknown error'
}

const api = {
	client: axiosInstance,
	users: users(axiosInstance),
	projects: projects(axiosInstance),
	invoices: invoices(axiosInstance),
	getErrorMessage,
}

export default api
