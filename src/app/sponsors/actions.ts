'use server'

import { AdminClient } from '@/core/client'
import { sponsorCreateSchema } from '@/core/client/sponsors/sponsors-schema'
import { safeAction } from '@/lib/safe-action'
import { redirect } from 'next/navigation'

export const createSponsor = safeAction
	.schema(sponsorCreateSchema)
	.action(async ({ parsedInput }) => {
		const adminClient = new AdminClient()
		const invoice = await adminClient.sponsors.create(parsedInput)
		redirect(`/sponsors/${invoice.sponsorship_id}`)
	})
