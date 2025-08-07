import { Client } from '@/core/client'
import { getCachedServiceByIdOrSlug } from '@/lib/cache/services'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import { ReactNode } from 'react'

export async function generateMetadata({
	params,
}: {
	params: { serviceIdOrSlug: string }
}): Promise<Metadata> {
	const service = await getCachedServiceByIdOrSlug(params.serviceIdOrSlug)

	if (!service) {
		return {
			title: 'Not Found | NanoPay.me',
		}
	}

	return {
		title: {
			template: `%s - ${service.name} | NanoPay.me`,
			default: `${service.name} | NanoPay.me`,
		},
	}
}

export default async function ServiceLayout({
	children,
	params,
}: {
	children: ReactNode
	params: { serviceIdOrSlug: string }
}) {
	const client = new Client(await cookies())

	after(() => {
		client.services.updateLastServiceAccessed(params.serviceIdOrSlug)
	})

	return children
}
