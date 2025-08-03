'use client'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Service } from '@/core/client'
import { ServiceAvatar } from './ServiceAvatar'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'
import { useScreenObserver } from '@/hooks/useScreenObserver'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer'
import { usePreferences } from '@/contexts/PreferencesProvider'
import clsx from 'clsx'
import { CardDescription } from './ui/card'

export interface ServicesNavigationMenuProps {
	children: React.ReactNode
}

export function ServicesNavigationMenu({
	children,
}: ServicesNavigationMenuProps) {
	const { isMobile } = useScreenObserver()
	const { currentService, services } = usePreferences()

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger asChild>{children}</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="flex items-center justify-between gap-4">
						<DrawerTitle>Services</DrawerTitle>
						<CardDescription className="rounded-full bg-slate-100 px-2 font-semibold text-slate-600">
							{services.length} of {services.length}
						</CardDescription>
					</DrawerHeader>
					<div className="pb-safe-offset-4 min-h-48 flex flex-col justify-between gap-4 px-4 pt-2">
						<ServicesList
							services={services}
							current={currentService?.id || null}
						/>
						<div className="mt-2 flex flex-1 items-center justify-center border-t border-slate-200 py-2">
							<Link href="/services/new">
								<Button
									className="flex w-full items-center justify-start gap-2 text-base font-medium hover:bg-slate-200"
									variant="outline"
								>
									<PlusCircleIcon className="text-nano h-5 w-5" />
									Create Service
								</Button>
							</Link>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-80" align="start">
				<div className="grid gap-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium leading-none">Services</h4>
						<kbd className="bg-muted pointer-events-none flex h-5 select-none items-center gap-1 rounded-sm border px-1.5 font-mono text-xs font-medium opacity-100">
							Esc
						</kbd>
					</div>
					<ServicesList
						services={services}
						current={currentService?.id || null}
					/>
					<Link href="/services/new" className="w-full">
						<Button
							className="flex w-full items-center justify-start gap-2 text-base font-medium hover:bg-slate-200"
							variant="ghost"
						>
							<PlusCircleIcon className="text-nano h-5 w-5" />
							Create Service
						</Button>
					</Link>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function ServicesList({
	services,
	current,
}: {
	services: Service[]
	current: string | null
}) {
	return (
		<div className="grid gap-2">
			{services.map(service => (
				<Link href={`/${service.slug}`} className="w-full" key={service.id}>
					<Button
						variant="ghost"
						key={service.id}
						className={clsx(
							'flex h-16 w-full items-center justify-start gap-2 text-lg font-medium sm:h-12',
							service.id === current && 'bg-nano/10',
						)}
					>
						<ServiceAvatar
							id={service.id}
							size={24}
							src={service.avatar_url}
							alt={service.name}
							className="border-slate-300"
						/>
						{service.name}
						<div className="flex grow justify-end">
							{service.id === current && (
								<CheckIcon className="text-nano h-5 w-5" />
							)}
						</div>
					</Button>
				</Link>
			))}
		</div>
	)
}
