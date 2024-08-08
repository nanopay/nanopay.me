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
	MenuIcon,
	XIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Logomark } from '@/components/Logo'
import { Button } from '@/components/Button'

export default function ApiDocsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen w-full flex-1 flex-col md:flex">
			<ApiDocsSidebar />
			<ApiDocsMobileHeader />
			<main className="flex flex-1 flex-col md:ml-48 lg:ml-64">
				<article className="prose lg:prose-lg prose-slate max-w-3xl p-6">
					{children}
				</article>
			</main>
		</div>
	)
}

function ApiDocsMobileHeader() {
	const [isOpen, setIsOpen] = useState(false)

	const handleToggleMenu = () => {
		setIsOpen(prev => !prev)
	}

	return (
		<header className="sticky left-0 top-0 w-full bg-slate-900 p-4 md:hidden">
			<div className="relative flex items-center justify-between gap-16">
				<Link
					href="/api"
					aria-label="Home"
					className="flex items-center text-white"
				>
					<Logomark theme="dark" className="h-6 w-auto" />
					<span className="ml-2 text-xl font-semibold">API Docs</span>
				</Link>
				<div>
					<Button
						type="button"
						color="nano"
						variant="outline"
						size="icon"
						className="rounded-full"
						onClick={handleToggleMenu}
					>
						{isOpen ? (
							<XIcon className="h-6 w-6" />
						) : (
							<MenuIcon className="h-6 w-6" />
						)}
					</Button>
				</div>
			</div>
			{isOpen && (
				<div className="flex-1 overflow-auto py-2">
					<ApiDocsNavbar />
				</div>
			)}
		</header>
	)
}

function ApiDocsSidebar() {
	return (
		<aside className="fixed top-0 hidden h-screen w-48 flex-col border-r bg-slate-900 text-white md:flex lg:w-64">
			<div className="flex h-[60px] items-center border-b border-slate-700 px-4 lg:px-6">
				<Link
					href="/api"
					className="flex items-center gap-2 text-xl font-semibold"
					prefetch={false}
				>
					<Logomark theme="dark" className="h-5 w-auto" />
					<span>API Docs</span>
				</Link>
			</div>
			<div className="flex-1 overflow-auto py-2">
				<ApiDocsNavbar />
			</div>
		</aside>
	)
}

function ApiDocsNavbar() {
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
