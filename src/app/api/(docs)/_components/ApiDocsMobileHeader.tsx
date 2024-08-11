'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { Logomark } from '@/components/Logo'
import { ApiDocsNavbar } from './ApiDocsNavbar'

export function ApiDocsMobileHeader() {
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
					<ApiDocsNavbar onClick={handleToggleMenu} />
				</div>
			)}
		</header>
	)
}
