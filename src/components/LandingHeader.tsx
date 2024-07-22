'use client'

import Link from 'next/link'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { links, NavLinks } from '@/components/NavLinks'
import { cn } from '@/lib/cn'
import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

interface LandingHeaderProps extends React.ComponentProps<'header'> {}

export function LandingHeader({ ...props }: LandingHeaderProps) {
	const [isOpen, setIsOpen] = useState(false)

	const handleToggleMenu = () => {
		setIsOpen(prev => !prev)
	}

	return (
		<header
			{...props}
			className={cn(
				'w-full bg-slate-50',
				isOpen && 'fixed inset-0 z-50',
				props.className,
			)}
		>
			<nav>
				<Container className="relative flex h-16 items-center justify-between">
					<div className="relative flex items-center gap-16">
						<Link href="/" aria-label="Home">
							<Logo className="h-auto w-48" />
						</Link>
						<div className="hidden lg:flex lg:gap-10">
							<NavLinks />
						</div>
					</div>
					<div className="hidden sm:block">
						<Link href="/login">
							<Button color="slate" className="p-5 text-lg" type="button">
								Login
							</Button>
						</Link>
					</div>
					<div className="sm:hidden">
						<Button
							type="button"
							color="slate"
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
				</Container>
				{isOpen && (
					<Container className="mt-4 sm:hidden">
						<div className="flex flex-col gap-4">
							<Link href="/login">
								<Button
									color="slate"
									className="h-12 w-full text-lg"
									variant="outline"
								>
									Login
								</Button>
							</Link>
							<Link href="/signup">
								<Button color="slate" className="h-12 w-full text-lg">
									Sign Up
								</Button>
							</Link>
							<div className="flex flex-col divide-y divide-slate-200">
								{links.map(([label, href]) => (
									<Link key={label} href={href}>
										<Button
											className="flex h-12 w-full justify-start text-lg"
											variant="link"
											color="slate"
										>
											{label}
										</Button>
									</Link>
								))}
							</div>
						</div>
					</Container>
				)}
			</nav>
		</header>
	)
}
