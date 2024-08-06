import Link from 'next/link'
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible'
import {
	BookIcon,
	ChevronRightIcon,
	CodeIcon,
	FileTextIcon,
	HelpCircleIcon,
	LayersIcon,
	LayoutGridIcon,
} from 'lucide-react'

export default function ApiDocsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="grid min-h-screen w-full grid-cols-[280px_1fr]">
			<ApiDocsSidebar />
			<article className="prose md:prose-lg prose-slate max-w-3xl p-6">
				{children}
			</article>
		</div>
	)
}

function ApiDocsSidebar() {
	return (
		<aside className="sticky top-0 flex h-full max-h-screen flex-col border-r bg-slate-900 text-white">
			<div className="flex h-[60px] items-center border-b border-slate-700 px-6">
				<Link
					href="#"
					className="flex items-center gap-2 font-semibold"
					prefetch={false}
				>
					<CodeIcon className="h-6 w-6" />
					<span>NanoPay.me API</span>
				</Link>
			</div>
			<div className="flex-1 overflow-auto py-2">
				<nav className="grid gap-1 px-4 text-sm font-medium">
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
			</div>
		</aside>
	)
}
