'use client'

import { Logo } from './Logo'
import Link from 'next/link'
import { InvoicePublic } from '@/core/client'
import { ServiceAvatar } from './ServiceAvatar'
import { SITE_URL, SUPPORT_EMAIL } from '@/core/constants'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from './ui/accordion'
import { InvoicePayCard } from '@/components/InvoicePayCard'

export default function Checkout({
	invoice,
	xnoToUsd,
}: {
	invoice: InvoicePublic
	xnoToUsd: number | null
}) {
	return (
		<div className="flex w-full flex-col overflow-hidden shadow md:flex-row md:rounded-2xl">
			<nav className="hidden w-72 flex-col items-center justify-between gap-16 border-r border-[#1e2c3d] bg-[#1e2c3d] px-4 py-2 sm:rounded-l-3xl md:flex">
				<div className="hidden md:block">
					<div className="mt-4 flex flex-col items-center gap-2 p-4 text-white">
						<ServiceAvatar
							id={invoice.service.id}
							src={invoice.service.avatar_url}
							alt={invoice.service.name}
						/>
						<h2 className="text-lg font-semibold">{invoice.service.name}</h2>
					</div>
					<div className="h-1/2 overflow-y-auto">
						<div className="mt-8 p-4 text-white">
							<h2 className="pb-2 font-semibold">{invoice.title}</h2>
							<p className="mt-2 text-sm">
								{invoice.description || 'No description'}
							</p>
						</div>
					</div>
				</div>

				<div className="w-48 p-4">
					<Link
						href={SITE_URL}
						target="_blank"
						className="flex flex-col text-slate-200"
					>
						<span className="text-xs font-semibold">Powered by</span>
						<Logo className="h-auto w-full" theme="dark" />
					</Link>
				</div>
			</nav>

			<nav className="flex w-full justify-center bg-slate-800 p-4 md:hidden">
				<Link href="/">
					<Logo className="h-auto w-36" theme="dark" />
				</Link>
			</nav>

			<Accordion
				type="single"
				collapsible
				className="border-b border-slate-200 px-4 md:hidden"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="!no-underline">
						<div className="flex items-center gap-2 text-left">
							<ServiceAvatar
								id={invoice.service.id}
								src={invoice.service.avatar_url}
								alt={invoice.service.name}
							/>
							<div className="ml-2 w-full">
								<h2 className="text-lg font-semibold leading-5">
									{invoice.service.name}
								</h2>
								<p className="text-sm">{invoice.title}</p>
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<p className="text-sm">{invoice.description || 'No description'}</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<main className="flex flex-1 flex-col items-center justify-between bg-white">
				<InvoicePayCard
					invoice={invoice}
					xnoToUsd={xnoToUsd}
					className="flex-1 rounded-none border-none shadow-none"
				/>

				<footer className="text-2xs flex w-full items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-center text-slate-400">
					<Link href="/terms" className="hover:text-nano flex-1">
						Terms of Service
					</Link>
					<div className="mx-2 text-slate-100">|</div>
					<Link href="/privacy" className="hover:text-nano flex-1">
						Privacy Policy
					</Link>
					<div className="mx-2 text-slate-100">|</div>
					<a
						href={`mailto:${SUPPORT_EMAIL}`}
						className="hover:text-nano flex-1"
					>
						{SUPPORT_EMAIL}
					</a>
				</footer>
			</main>
		</div>
	)
}
