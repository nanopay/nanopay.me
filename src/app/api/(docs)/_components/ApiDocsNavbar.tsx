'use client'

import Link from 'next/link'
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible'
import {
	BookIcon,
	ChevronRightIcon,
	FileTextIcon,
	HelpCircleIcon,
	LayersIcon,
	LayoutGridIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const endpoints: { title: string; href: string }[] = [
	{
		title: 'Create Invoice',
		href: '/api/create-invoice',
	},
	{
		title: 'Get Invoice',
		href: '/api/get-invoice',
	},

	{
		title: 'List Invoices',
		href: '/api/list-invoices',
	},
	{
		title: 'Get Serivce',
		href: '/api/get-service',
	},
]

export function ApiDocsNavbar({ onClick }: { onClick?: () => void }) {
	const pathname = usePathname()
	const isEndpointPath = endpoints.some(endpoint => endpoint.href)

	return (
		<nav className="grid flex-1 gap-1 overflow-auto px-2 py-2 text-lg font-medium md:text-sm lg:px-4">
			<Link
				href="/api#introduction"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
				onClick={onClick}
			>
				<BookIcon className="h-4 w-4" />
				Introduction
			</Link>
			<Link
				href="/api#authentication"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
				onClick={onClick}
			>
				<LayersIcon className="h-4 w-4" />
				Authentication
			</Link>
			<Collapsible className="grid gap-1" defaultOpen={isEndpointPath}>
				<CollapsibleTrigger className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all [&[data-state=open]>svg]:rotate-90">
					<LayoutGridIcon className="h-4 w-4" />
					Endpoints
					<ChevronRightIcon className="ml-auto h-4 w-4 transition-all" />
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="-mx-3 grid gap-1 rounded-md bg-slate-800 p-3">
						{endpoints.map(endpoint => (
							<Link
								href={endpoint.href}
								className={cn(
									'flex items-center gap-3 rounded-md px-3 py-2 text-slate-100 transition-all',
									pathname === endpoint.href
										? 'bg-primary text-white'
										: 'hover:bg-primary/5 hover:text-primary',
								)}
								onClick={onClick}
							>
								<span className="text-lg leading-5">•</span> {endpoint.title}
							</Link>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
			<Link
				href="#"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
			>
				<FileTextIcon className="h-4 w-4" />
				Changelog
			</Link>
			<Link
				href="#"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
			>
				<HelpCircleIcon className="h-4 w-4" />
				Support
			</Link>
		</nav>
	)
}
