import { Button } from '@/components/Button'
import Invoices from '@/components/Invoices'
import api from '@/services/api'
import { PlusIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

const fetchData = async (serviceName: string) => {
	return await api.invoices.list(serviceName, {
		headers: {
			Cookie: cookies().toString(),
		},
		next: {
			revalidate: false,
			tags: [`service-${serviceName}-invoices`],
		},
	})
}

interface Props {
	params: { serviceName: string }
}

export default async function InvoicesPage({ params: { serviceName } }: Props) {
	const invoices = await fetchData(serviceName)
	return (
		<div className="w-full max-w-7xl">
			<header className="px-1 py-4">
				<div className="flex items-center">
					<h1 className="flex-1 text-lg font-medium">Invoices</h1>
					<Link href={`/${serviceName}/invoices/new`}>
						<Button color="nano" size="sm">
							<PlusIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
							Create Invoice
						</Button>
					</Link>
				</div>
			</header>
			<Invoices invoices={invoices || []} serviceName={serviceName} />
		</div>
	)
}
