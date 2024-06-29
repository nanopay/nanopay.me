'use client'

import * as React from 'react'
import Link from 'next/link'
import { LogOutIcon, LucideIcon, UserRoundIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverProps } from '@radix-ui/react-popover'

interface NavLink {
	title: string
	href: string
	description: string
	icon: LucideIcon
	visible?: boolean
}

const navLinks = (canViewProfile: boolean): NavLink[] => [
	{
		title: 'Profile',
		icon: UserRoundIcon,
		href: '/profile',
		description: 'View and edit your profile',
		visible: canViewProfile,
	},
	{
		title: 'Logout',
		icon: LogOutIcon,
		href: '/logout',
		description: 'Sign out of your account',
		visible: true,
	},
]

export interface UserNavigationPopoverProps extends PopoverProps {
	canViewProfile?: boolean
}

export function UserNavigationPopover({
	canViewProfile = true,
	children,
	...props
}: UserNavigationPopoverProps) {
	return (
		<Popover {...props}>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent align="end" className="w-80">
				<ul className="grid w-full gap-3">
					{navLinks(canViewProfile)
						.filter(({ visible }) => visible)
						.map(component => (
							<NavListItem
								key={component.title}
								title={component.title}
								href={component.href}
								icon={component.icon}
								description={component.description}
							/>
						))}
				</ul>
			</PopoverContent>
		</Popover>
	)
}

function NavListItem({ title, icon: Icon, href, description }: NavLink) {
	return (
		<li>
			<Link
				className="hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100"
				href={href}
			>
				<div className="flex flex-shrink-0">
					<Icon className="text-nano h-7 w-7" />
				</div>
				<div className="flex flex-col">
					<div className="mb-2 text-base font-medium leading-none text-slate-800">
						{title}
					</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug text-slate-500">
						{description}
					</p>
				</div>
			</Link>
		</li>
	)
}
