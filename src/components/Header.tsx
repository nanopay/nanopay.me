import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import clsx from 'clsx'
import { Popover, PopoverButtonProps } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import { UserProfile } from '@/types/users'

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
	user?: UserProfile
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

export function Header({ user, size = 'md', ...props }: HeaderProps) {
	const supabaseClient = useSupabaseClient()
	const router = useRouter()

	const sizes = getSize(size)

	const logout = async () => {
		await supabaseClient.auth.signOut()
		await router.push('/login')
	}

	const isDashboard = router.pathname.startsWith('/dashboard')

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
														{user ? (
															<div className="w-full border-y border-slate-200">
																<div className="w-full py-4 flex items-center space-x-2">
																	<Image
																		src={user.avatar_url}
																		alt="user avatar"
																		className="rounded-full"
																		width={sizes.avatar}
																		height={sizes.avatar}
																	/>
																	<div className="font-semibold">
																		{user.name}
																	</div>
																</div>
																<Button
																	onClick={() => logout()}
																	variant="outline"
																	className="w-full"
																>
																	<div className="flex w-full">Log out</div>
																</Button>
															</div>
														) : (
															<Button href="/login" variant="outline">
																Log in
															</Button>
														)}
													</div>
												</Popover.Panel>
											</>
										)}
									</AnimatePresence>
								</>
							)}
						</Popover>

						<div className="hidden lg:block">
							{user ? (
								<div className="flex items-center space-x-4">
									<Image
										src={user.avatar_url}
										alt="user avatar"
										className="rounded-full"
										width={sizes.avatar}
										height={sizes.avatar}
									/>
									{!isDashboard && (
										<>
											<div className="h-8 border-l border-slate-200" />
											<Button href="/dashboard" variant="outline">
												Dashboard
											</Button>
										</>
									)}
								</div>
							) : (
								<Button href="/login" variant="solid" color="slate">
									Log in
								</Button>
							)}
						</div>
					</div>
				</Container>
			</nav>
		</header>
	)
}
