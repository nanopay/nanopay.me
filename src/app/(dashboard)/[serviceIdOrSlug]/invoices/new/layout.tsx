import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'New Invoice',
}

export default function NewInvoiceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
