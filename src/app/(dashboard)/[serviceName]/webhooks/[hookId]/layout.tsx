'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function WebhookLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const serviceName = useParams().serviceName as string
	const hookId = useParams().hookId as string

	const tabs = [
		{
			label: 'Settings',
			value: 'settings',
			href: `/${serviceName}/webhooks/${hookId}/settings`,
		},
		{
			label: 'Deliveries',
			value: 'deliveries',
			href: `/${serviceName}/webhooks/${hookId}/deliveries`,
		},
	]

	const activeTab = tabs.find(tab => pathname.endsWith(tab.value))?.value

	return (
		<div className="w-full">
			<Tabs value={activeTab} className="mb-4 border-b border-slate-200">
				<TabsList className="grid w-fit grid-cols-2 uppercase">
					{tabs.map((tab, index) => (
						<TabsTrigger key={index} value={tab.value} asChild>
							<Link href={tab.href}>{tab.label}</Link>
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			{children}
		</div>
	)
}
