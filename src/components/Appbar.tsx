'use client'

import { useState } from 'react'
import { Logomark } from '@/components/Logo'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/contexts/UserProvider'
import { usePreferences } from '@/contexts/PreferencesProvider'
import { ChevronsUpDownIcon } from 'lucide-react'
import { ServiceAvatar } from './ServiceAvatar'
import { ServicesNavigationMenu } from './ServicesNavigationMenu'
import { Button } from './Button'
import { cn } from '@/lib/cn'
import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { UserNavigationPopover } from './UserNavigationPopover'
import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { NotificationsPopoverButton } from './NotificationsPopoverButton'

export interface AppbarProps extends React.ComponentProps<'header'> {}

export default function Appbar({ ...props }: AppbarProps) {
	const user = useUser()
	const { currentService } = usePreferences()
	const [hoveredLink, setHoveredLink] = useState<string | null>(null)

	const pathname = usePathname()

	const serviceNavigation = [
		{
			name: 'Overview',
			href: `/${currentService?.slug}`,
			current: pathname === '/[serviceIdOrSlug]',
		},
		{
			name: 'Invoices',
			href: `/${currentService?.slug}/invoices`,
			current: pathname === '/[serviceIdOrSlug]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/${currentService?.slug}/webhooks`,
			current: pathname === '/[serviceIdOrSlug]/webhooks',
		},
		{
			name: 'API Keys',
			href: `/${currentService?.slug}/keys`,
			current: pathname === '/[serviceIdOrSlug]/keys',
		},
		{
			name: 'Settings',
			href: `/${currentService?.slug}/settings`,
			current: pathname === '/[serviceIdOrSlug]/settings',
		},
	]

	const isAccountSetingsPage = pathname === '/account'

	return (
		<>
			<header
				{...props}
				className={cn(
					'supports-backdrop-filter:bg-background/60 flex w-full items-center justify-between gap-8 bg-white/50 px-4 pt-4 backdrop-blur-sm sm:px-6 lg:px-8',
					!currentService && 'border-b border-slate-200 pb-4',
					props.className,
				)}
			>
				<div className="flex items-center gap-2 overflow-hidden">
					<Link href={currentService ? `/${currentService.slug}` : '/'}>
						<Logomark className="ml-2 hidden h-8 w-8 sm:block" />
					</Link>

					<>
						<div className="hidden sm:block">
							<SlashIcon />
						</div>

						<div className="flex gap-1 overflow-hidden">
							{currentService && (
								<Link
									href={`/${currentService.slug}`}
									className="flex items-center gap-2 overflow-hidden text-base font-semibold text-slate-700"
								>
									<ServiceAvatar
										id={currentService.id}
										size={20}
										src={currentService.avatar_url}
										alt={currentService.name}
										className="border-slate-300"
									/>
									<div className="truncate">{currentService.name}</div>
								</Link>
							)}
							{isAccountSetingsPage && (
								<div className="flex items-center text-base font-semibold text-slate-700">
									Account Settings
								</div>
							)}
							<ServicesNavigationMenu key={currentService?.id}>
								<Button
									variant="ghost"
									size="icon"
									type="button"
									className="active:outline-hidden h-8 w-7"
								>
									<ChevronsUpDownIcon className="h-6 w-4 text-slate-500" />
								</Button>
							</ServicesNavigationMenu>
						</div>
					</>
				</div>

				<div className="flex items-center gap-x-4 lg:gap-x-6">
					{!!currentService && (
						<NotificationsPopoverButton
							key={currentService.id}
							serviceId={currentService.id}
						/>
					)}

					<UserNavigationPopover>
						<Image
							width={40}
							height={40}
							className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 sm:h-9 sm:w-9"
							src={user.avatar_url || DEFAULT_AVATAR_URL}
							alt=""
						/>
					</UserNavigationPopover>
				</div>
			</header>
			{currentService && (
				<nav className="supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex items-center gap-x-4 border-b border-slate-200 bg-white/50 px-4 backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8">
					<Tabs value={pathname}>
						<TabsList className="gap-2">
							{serviceNavigation.map(item => (
								<TabsTrigger
									value={item.href}
									key={item.href}
									className="group px-0 py-1"
								>
									<Link
										key={item.href}
										href={item.href}
										className="relative rounded-md px-3 py-2 text-sm transition-colors delay-150"
										onMouseEnter={() => setHoveredLink(item.href)}
										onMouseLeave={() => setHoveredLink(null)}
									>
										<AnimatePresence>
											{hoveredLink === item.href && (
												<motion.span
													className="absolute inset-0 rounded-lg bg-slate-100"
													layoutId="hoverBackground"
													initial={{ opacity: 0 }}
													animate={{
														opacity: 1,
														transition: { duration: 0.1 },
													}}
													exit={{
														opacity: 0,
														transition: { duration: 0.1, delay: 0.1 },
													}}
												/>
											)}
										</AnimatePresence>
										<span className="relative z-10">{item.name}</span>
									</Link>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</nav>
			)}
		</>
	)
}

function SlashIcon() {
	return (
		<svg
			className="text-slate-400"
			data-testid="geist-icon"
			fill="currentColor"
			shapeRendering="geometricPrecision"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			height="24"
			width="24"
		>
			<path d="M16.88 3.549L7.12 20.451"></path>
		</svg>
	)
}
