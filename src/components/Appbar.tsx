'use client'

import { useState } from 'react'
import { Logomark } from '@/components/Logo'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/contexts/UserProvider'
import { usePreferences } from '@/contexts/PreferencesProvider'
import { BellIcon, ChevronsUpDownIcon } from 'lucide-react'
import { ServiceAvatar } from './ServiceAvatar'
import { ServicesPopover } from './ServicesPopover'
import { Button } from './Button'
import { Service } from '@/types/services'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { UserNavigationPopover } from './UserNavigationPopover'

export interface AppbarProps extends React.ComponentPropsWithoutRef<'header'> {
	services: Service[]
}

export default function Appbar({ services, ...props }: AppbarProps) {
	const user = useUser()
	const { currentService } = usePreferences()
	const [hoveredLink, setHoveredLink] = useState<string | null>(null)

	const pathname = usePathname()

	const serviceNavigation = [
		{
			name: 'Overview',
			href: `/${currentService?.name}`,
			current: pathname === '/[serviceName]',
		},
		{
			name: 'Invoices',
			href: `/${currentService?.name}/invoices`,
			current: pathname === '/[serviceName]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/${currentService?.name}/hooks`,
			current: pathname === '/[serviceName]/hooks',
		},
		{
			name: 'API Keys',
			href: `/${currentService?.name}/keys`,
			current: pathname === '/[serviceName]/keys',
		},
		{
			name: 'Settings',
			href: `/${currentService?.name}/settings`,
			current: pathname === '/[serviceName]/settings',
		},
	]

	return (
		<>
			<header
				{...props}
				className={cn(
					'supports-[backdrop-filter]:bg-background/60 flex w-full items-center justify-between gap-8 bg-white/50 px-4 pt-4 backdrop-blur sm:px-6 lg:px-8',
					props.className,
				)}
			>
				<div className="flex items-center gap-2 overflow-hidden">
					<Logomark className="ml-2 hidden h-8 w-8 sm:block" />

					{currentService && (
						<>
							<div className="hidden sm:block">
								<SlashIcon />
							</div>

							<div className="flex gap-1 overflow-hidden">
								<Link
									href={`/${currentService.name}`}
									className="flex items-center gap-2 overflow-hidden text-base font-semibold text-slate-700"
								>
									<ServiceAvatar
										id={currentService.id}
										size={20}
										src={currentService.avatar_url}
										alt={currentService.display_name}
										className="border-slate-300"
									/>
									<div className="truncate">{currentService.display_name}</div>
								</Link>
								<ServicesPopover services={services}>
									<Button
										variant="ghost"
										size="icon"
										type="button"
										className="h-8 w-7 active:outline-none"
									>
										<ChevronsUpDownIcon className="h-6 w-4 text-slate-500" />
									</Button>
								</ServicesPopover>
							</div>
						</>
					)}
				</div>

				<div className="flex items-center gap-x-4 lg:gap-x-6">
					<Button
						type="button"
						variant="outline"
						className="hover:text-nano -m-2.5 aspect-square h-8 w-8 rounded-full border-slate-300 p-0 text-slate-500 sm:h-9 sm:w-9"
					>
						<span className="sr-only">View notifications</span>
						<BellIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
					</Button>

					<UserNavigationPopover>
						<Image
							width={40}
							height={40}
							className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 sm:h-9 sm:w-9"
							src={user.avatar_url}
							alt=""
						/>
					</UserNavigationPopover>
				</div>
			</header>
			<nav className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex items-center gap-x-4 border-b border-slate-200 bg-white/50 px-4 backdrop-blur sm:gap-x-6 sm:px-6 lg:px-8">
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
