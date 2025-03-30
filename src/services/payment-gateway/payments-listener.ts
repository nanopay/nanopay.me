import { paymentSchema } from '@/core/client/invoices/invoices-schemas'
import { z } from 'zod'

const PAYMENT_NOTIFIER_CLOSE_REASON_CODE = {
	PAID: 1000, // Normal closure: Payment completed
	EXPIRED: 4001, // Custom: Payment expired
	TOO_MANY_PAYMENTS: 4002, // Custom: Too many payment attempts
}

const HEARTBEAT_INTERVAL = 5000 // 5 seconds
const HEARTBEAT_TIMEOUT = 10000 // 10 seconds

const paymentNotificationSchema = paymentSchema.omit({ id: true })
export type PaymentNotification = z.infer<typeof paymentNotificationSchema>

export class PaymentListener {
	private websocket: WebSocket | null = null
	private invoiceId: string
	private url: string
	private lastPong = 0
	private heartbeatInterval: NodeJS.Timeout | null = null
	_payments = new Map<string, PaymentNotification>()

	constructor(invoiceId: string) {
		this.url = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL!
		if (!URL.canParse(this.url)) {
			throw new Error('NEXT_PUBLIC_PAYMENT_GATEWAY_URL must be a valid URL')
		}
		this.invoiceId = invoiceId
	}

	connect({
		onPayment,
		onError,
		onOpen,
		onClose,
	}: {
		onPayment: (payment: PaymentNotification) => void
		onError?: (error: Event) => void
		onOpen?: () => void
		onClose?: () => void
	}) {
		if (this.websocket) return

		const websocketUrl = this.buildPaymentsWebsocketUrl(this.invoiceId)
		this.websocket = new WebSocket(websocketUrl)

		this.websocket.onopen = () => {
			console.info(`WebSocket connected for invoice ${this.invoiceId}`)
			this.startHeartbeat()
			onOpen?.()
		}

		this.websocket.onmessage = event => {
			try {
				if (event.data === 'pong') {
					this.lastPong = Date.now()
					return
				}
				const json = JSON.parse(event.data)
				const data = paymentNotificationSchema.parse(json)
				if (this._payments.has(data.hash)) return
				this._payments.set(data.hash, data)
				onPayment(data)
			} catch (error) {
				console.error('Error parsing WebSocket message:', error)
			}
		}

		this.websocket.onerror = error => {
			console.error(`WebSocket error for invoice ${this.invoiceId}:`, error)
			onError?.(error)
		}

		this.websocket.onclose = event => {
			switch (event.code) {
				case PAYMENT_NOTIFIER_CLOSE_REASON_CODE.PAID:
					console.info(`Payment completed for invoice ${this.invoiceId}`)
					break
				case PAYMENT_NOTIFIER_CLOSE_REASON_CODE.EXPIRED:
					console.warn(`Payment expired for invoice ${this.invoiceId}`)
					break
				case PAYMENT_NOTIFIER_CLOSE_REASON_CODE.TOO_MANY_PAYMENTS:
					console.warn(
						`Too many payment attempts for invoice ${this.invoiceId}`,
					)
					break
				default:
					console.error(
						`Unexpected closure for invoice ${this.invoiceId} - Code: ${event.code}, Reason: ${event.reason}`,
					)
					setTimeout(() => {
						this.connect({ onPayment, onError, onOpen, onClose })
					}, 1000)
			}
			this.stopHeartbeat()
			this.websocket = null
			onClose?.()
		}
	}

	private startHeartbeat() {
		this.stopHeartbeat()
		this.lastPong = Date.now()
		this.heartbeatInterval = setInterval(() => {
			if (!this.isConnected()) return
			if (Date.now() - this.lastPong > HEARTBEAT_TIMEOUT) {
				console.warn('No heartbeat response, closing connection')
				this.websocket?.close(1006, 'HEARTBEAT_TIMEOUT')
				return
			}
			this.websocket?.send('ping')
		}, HEARTBEAT_INTERVAL)
	}

	private stopHeartbeat() {
		if (!this.heartbeatInterval) return
		clearInterval(this.heartbeatInterval)
		this.heartbeatInterval = null
	}

	private buildPaymentsWebsocketUrl = (invoiceId: string) => {
		const url = new URL(
			this.url.replace('http://', 'ws://').replace('https://', 'wss://'),
		)
		url.pathname = `/invoices/${invoiceId}/payments`
		return url.toString()
	}

	isConnected(): boolean {
		return this.websocket?.readyState === WebSocket.OPEN
	}

	disconnect() {
		if (this.isConnected()) {
			this.websocket!.close(1000, 'CLIENT_DISCONNECT')
		}
		this.websocket = null
	}

	get payments(): PaymentNotification[] {
		return Array.from(this._payments.values())
	}
}
