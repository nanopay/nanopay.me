import api from '@/services/api'
import PayInvoice from './invoice'

export default async function InvoicePage({
	params: { invoiceId },
}: {
	params: {
		invoiceId: string
	}
}) {
	try {
		const invoice = await api.invoices.get(invoiceId)
		const payments = await api.invoices.payments(invoiceId)

		return <PayInvoice invoice={invoice} payments={payments} />
	} catch (error) {
		const message = api.getErrorMessage(error) || 'Unknown error'
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Error</h1>
					<p className="text-gray-500">{message}</p>
				</div>
			</div>
		)
	}
}
