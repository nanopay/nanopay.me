'use server'

import { safeAction } from '@/lib/safe-action'
import { Client, invoiceCreateSchema } from '@/core/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const createInvoice = safeAction
	.schema(
		invoiceCreateSchema.extend({
			serviceIdOrSlug: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const client = new Client(cookies())

		const { id } = await client.invoices.create(parsedInput.serviceIdOrSlug, {
			title: parsedInput.title,
			description: parsedInput.description,
			metadata: parsedInput.metadata,
			price: parsedInput.price,
			recipient_address: parsedInput.recipient_address,
			redirect_url: parsedInput.redirect_url,
		})

		redirect(`/${parsedInput.serviceIdOrSlug}/invoices/${id}`)
	})
