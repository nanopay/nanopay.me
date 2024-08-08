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

export function ApiDocsNavbar() {
	return (
		<nav className="grid flex-1 gap-1 overflow-auto px-2 py-2 text-lg font-medium md:text-sm lg:px-4">
			<Link
				href="/api#introduction"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
			>
				<BookIcon className="h-4 w-4" />
				Introduction
			</Link>
			<Link
				href="/api#authentication"
				className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all"
				prefetch={false}
			>
				<LayersIcon className="h-4 w-4" />
				Authentication
			</Link>
			<Collapsible className="grid gap-1">
				<CollapsibleTrigger className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-slate-100 transition-all [&[data-state=open]>svg]:rotate-90">
					<LayoutGridIcon className="h-4 w-4" />
					Endpoints
					<ChevronRightIcon className="ml-auto h-4 w-4 transition-all" />
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="-mx-3 grid gap-1 rounded-md bg-slate-800 p-3">
						<Link
							href="/api/create-invoice"
							className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-md px-3 py-2 text-slate-100 transition-all"
							prefetch={false}
						>
							Create Invoice
						</Link>
						<Link
							href="/api/get-invoice"
							className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-md px-3 py-2 text-slate-100 transition-all"
							prefetch={false}
						>
							Get Invoice
						</Link>
						<Link
							href="/api/list-invoices"
							className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-md px-3 py-2 text-slate-100 transition-all"
							prefetch={false}
						>
							List Invoices
						</Link>
						<Link
							href="/api/get-service"
							className="hover:bg-primary/5 hover:text-primary flex items-center gap-3 rounded-md px-3 py-2 text-slate-100 transition-all"
							prefetch={false}
						>
							Get Service
						</Link>
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
