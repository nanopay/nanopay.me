import { getCachedServiceByIdOrSlug } from '@/lib/cache/services'
import { Metadata } from 'next'
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

export default function ServiceLayout({
	children,
	params,
}: {
	children: ReactNode
	params: { serviceIdOrSlug: String }
}) {
	return children
}
