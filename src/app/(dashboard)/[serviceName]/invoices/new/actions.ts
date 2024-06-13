'use server'

import paymentGateway from '@/services/payment-gateway'
import { InvoiceCreate } from '@/types/invoice'
import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const createInvoice = async (
	serviceName: string,
	{
		title,
		description,
		price,
		recipient_address,
		metadata,
		redirect_url,
	}: InvoiceCreate,
): Promise<string> => {
	const supabase = createClient(cookies())

	const { data: service, error } = await supabase
		.from('services')
		.select('id')
		.eq('name', serviceName)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	const { id } = await paymentGateway.invoices.create({
		service_id: service.id,
		title,
		description,
		metadata,
		price,
		recipient_address,
		redirect_url,
	})

	revalidateTag(`service-${serviceName}-invoices`)

	redirect(`/${serviceName}/invoices/${id}`)
}
