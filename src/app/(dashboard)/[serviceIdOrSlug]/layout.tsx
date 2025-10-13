import { Client } from '@/core/client'
import { getCachedServiceByIdOrSlug } from '@/lib/cache/services'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ serviceIdOrSlug: string }>
}): Promise<Metadata> {
	const { serviceIdOrSlug } = await params
	const service = await getCachedServiceByIdOrSlug(serviceIdOrSlug)

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
	params: Promise<{ serviceIdOrSlug: string }>
}) {
	const { serviceIdOrSlug } = await params
	const client = new Client(await cookies())
	await client.services.updateLastServiceAccessed(serviceIdOrSlug)

	return children
}
