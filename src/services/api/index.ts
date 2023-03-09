import axios from 'axios'
import { users } from './users'

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
	getErrorMessage,
}

export default api
