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
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<h1 className="mb-4 text-2xl font-bold">Error</h1>
					<p className="text-slate-500">{message}</p>
				</div>
			</div>
		)
	}
}
