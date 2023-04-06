import axios, { AxiosResponse } from 'axios'

export const axiosInstance = axios.create({
	baseURL: process.env.PAYMENT_WORKER_URL,
})

interface PaymentAddProps {
	invoiceId: string
}

const paymentWorker = {
	client: axiosInstance,
	getErrorMessage: (error: any): string => {
		const reason = error.response?.data?.reason
		if (reason && typeof reason === 'string') return reason
		return error.message || 'Unknown error'
	},
	queue: {
		add: async (
			data: PaymentAddProps,
		): Promise<AxiosResponse<Record<'message', string>>> => {
			return axiosInstance.post('/', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.PAYMENT_WORKER_AUTH_TOKEN}`,
				},
			})
		},
	},
}

export default paymentWorker
