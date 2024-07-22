import { Button } from '@/components/Button'
import Invoices from '@/components/Invoices'
import { Client } from '@/core/client'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Invoices',
}

interface Props {
	params: { serviceIdOrSlug: string }
}

export default async function InvoicesPage({
	params: { serviceIdOrSlug },
}: Props) {
	const client = new Client(cookies())
	const invoices = await client.invoices.list(serviceIdOrSlug)

	return (
		<div className="w-full max-w-7xl">
			<header className="px-1 py-4">
				<div className="flex items-center">
					<h1 className="flex-1 text-lg font-medium">Invoices</h1>
					<Link href={`/${serviceIdOrSlug}/invoices/new`}>
						<Button color="nano" size="sm">
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Invoice
						</Button>
					</Link>
				</div>
			</header>
			<Invoices invoices={invoices || []} serviceIdOrSlug={serviceIdOrSlug} />
		</div>
	)
}