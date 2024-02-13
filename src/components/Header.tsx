'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Popover, PopoverButtonProps } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'

function MenuIcon(props: React.ComponentProps<'svg'>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M5 6h14M5 18h14M5 12h14"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function ChevronUpIcon(props: React.ComponentProps<'svg'>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M17 14l-5-5-5 5"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function MobileNavLink({ children, ...props }: PopoverButtonProps<'a'>) {
	return (
		<Popover.Button
			as={Link}
			className="block text-base leading-7 tracking-tight text-gray-700"
			{...props}
		>
			{children}
		</Popover.Button>
	)
}

interface HeaderProps extends React.ComponentProps<'header'> {
	isAuthenticated: boolean
	size?: 'sm' | 'md' | 'lg'
}

const getSize = (size: HeaderProps['size']) => {
	switch (size) {
		case 'sm':
			return {
				py: 'py-2',
				logo: 'w-auto h-8',
				avatar: 36,
			}
		case 'md':
			return {
				py: 'py-2',
				logo: 'w-auto h-10',
				avatar: 40,
			}
		case 'lg':
			return {
				py: 'py-6',
				logo: 'w-auto h-12',
				avatar: 40,
			}
		default:
			return {
				py: 'py-4',
				logo: 'w-auto h-12',
				avatar: 40,
			}
	}
}

export function Header({
	isAuthenticated,
	size = 'md',
	...props
}: HeaderProps) {
	const pathname = usePathname()

	const sizes = getSize(size)

	const isHome = pathname?.startsWith('/home')

	return (
		<header {...props}>
			<nav>
				<Container
					className={clsx('relative z-50 flex justify-between', sizes.py)}
				>
					<div className={'relative z-10 flex items-center gap-16'}>
						<Link href="/" aria-label="Home">
							<Logo className={sizes.logo} />
						</Link>
						<div className="hidden lg:flex lg:gap-10">
							<NavLinks />
						</div>
					</div>
					<div className="flex items-center gap-6">
						<Popover className="lg:hidden">
							{({ open }) => (
								<>
									<Popover.Button
										className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
										aria-label="Toggle site navigation"
									>
										{({ open }) =>
											open ? (
												<ChevronUpIcon className="h-6 w-6" />
											) : (
												<MenuIcon className="h-6 w-6" />
											)
										}
									</Popover.Button>
									<AnimatePresence initial={false}>
										{open && (
											<>
												<Popover.Overlay
													static
													as={motion.div}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
												/>
												<Popover.Panel
													static
													as={motion.div}
													initial={{ opacity: 0, y: -32 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{
														opacity: 0,
														y: -32,
														transition: { duration: 0.2 },
													}}
													className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-20 shadow-2xl shadow-gray-900/20"
												>
													<div className="space-y-4">
														<MobileNavLink href="/#faqs">FAQs</MobileNavLink>
													</div>
													<div className="mt-8 flex flex-col gap-4">
														<Link href={isAuthenticated ? '/home' : '/login'}>
															<Button
																variant="outline"
																color="slate"
																className="w-full"
															>
																{isAuthenticated ? 'Home' : 'Log in'}
															</Button>
														</Link>
													</div>
												</Popover.Panel>
											</>
										)}
									</AnimatePresence>
								</>
							)}
						</Popover>

						<div className="hidden lg:block">
							<Link href={isAuthenticated ? '/home' : '/login'}>
								<Button color="slate">
									{isAuthenticated ? 'Home' : 'Log in'}
								</Button>
							</Link>
						</div>
					</div>
				</Container>
			</nav>
		</header>
	)
}
