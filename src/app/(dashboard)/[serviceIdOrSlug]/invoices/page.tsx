import { Button } from '@/components/Button'
import Invoices from '@/components/Invoices'
import { Client } from '@/core/client'
import { DEFAULT_INVOICES_PAGINATION_LIMIT } from '@/core/constants'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Invoices',
}

interface Props {
	params: Promise<{ serviceIdOrSlug: string }>
	searchParams: Promise<{ page?: string }>
}

export default async function InvoicesPage(props: Props) {
	const searchParams = await props.searchParams

	const { page } = searchParams

	const params = await props.params

	const { serviceIdOrSlug } = params

	const limit = DEFAULT_INVOICES_PAGINATION_LIMIT
	const pageNumber = (page && parseInt(page)) || 1
	const offset = (pageNumber - 1) * limit

	const client = new Client(await cookies())
	const { invoices, count } = await client.invoices.list(serviceIdOrSlug, {
		offset,
		limit,
	})

	return (
		<div className="w-full max-w-7xl">
			<header className="px-1 py-4">
				<div className="flex items-center">
					<h1 className="flex-1 text-xl font-semibold">Invoices</h1>
					<Link href={`/${serviceIdOrSlug}/invoices/new`}>
						<Button color="nano" size="sm">
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Invoice
						</Button>
					</Link>
				</div>
			</header>
			<Invoices
				invoices={invoices}
				serviceIdOrSlug={serviceIdOrSlug}
				count={count}
				limit={limit}
				offset={offset}
			/>
		</div>
	)
}
