'use server'

import { Client, InvoiceCreate } from '@/services/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const createInvoice = async (
	serviceNameOrId: string,
	{
		title,
		description,
		price,
		recipient_address,
		metadata,
		redirect_url,
	}: InvoiceCreate,
) => {
	const client = new Client(cookies())

	const { id } = await client.invoices.create(serviceNameOrId, {
		title,
		description,
		metadata,
		price,
		recipient_address,
		redirect_url,
	})

	redirect(`/${serviceNameOrId}/invoices/${id}`)
}
