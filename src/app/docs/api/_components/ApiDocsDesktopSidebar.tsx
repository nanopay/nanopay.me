import { Logomark } from '@/components/Logo'
import Link from 'next/link'
import { ApiDocsNavbar } from './ApiDocsNavbar'
import { Viewport } from 'next'
import { slate } from 'tailwindcss/colors'

export const viewport: Viewport = {
	themeColor: slate['900'],
}

export function ApiDocsDesktopSidebar() {
	return (
		<aside className="fixed top-0 hidden h-screen w-48 flex-col border-r bg-slate-900 text-white md:flex lg:w-64">
			<div className="flex h-[60px] items-center border-b border-slate-700 px-4 lg:px-6">
				<Link
					href="/docs/api"
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
