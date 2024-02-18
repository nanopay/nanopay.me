'use client'

import { Dialog, Transition } from '@headlessui/react'

import { Fragment, useState } from 'react'
import { Logo } from './Logo'
import { Service } from '@/types/services'
import Image from 'next/image'
import clsx from 'clsx'
import {
	Collapse,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePreferences } from '@/contexts/PreferencesProvider'
import {
	BanknoteIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	HomeIcon,
	KeyRoundIcon,
	SettingsIcon,
	UserRoundIcon,
	WebhookIcon,
	XIcon,
} from 'lucide-react'
import { Button } from './Button'

export interface SidebarProps {
	services: Service[]
}

export function Sidebar({ services }: SidebarProps) {
	const router = useRouter()
	const pathname = usePathname()
	const { currentService } = usePreferences()

	const [openServices, setOpenServices] = useState<boolean>(false)

	const defaultNavigation = [
		{
			name: 'Home',
			href: '/home',
			icon: HomeIcon,
			current: pathname === '/home',
		},
		{
			name: 'Profile',
			href: '/profile',
			icon: UserRoundIcon,
			current: pathname === '/profile',
		},
	]

	const serviceNavigation = [
		{
			name: 'Dashboard',
			href: `/${currentService?.name}`,
			icon: HomeIcon,
			current: pathname === '/[serviceName]',
		},
		{
			name: 'Invoices',
			href: `/${currentService?.name}/invoices`,
			icon: BanknoteIcon,
			current: pathname === '/[serviceName]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/${currentService?.name}/hooks`,
			icon: WebhookIcon,
			current: pathname === '/[serviceName]/hooks',
		},
		{
			name: 'Api Keys',
			href: `/${currentService?.name}/keys`,
			icon: KeyRoundIcon,
			current: pathname === '/[serviceName]/keys',
		},
		{
			name: 'Settings',
			href: `/${currentService?.name}/settings`,
			icon: SettingsIcon,
			current: pathname === '/[serviceName]/settings',
		},
	]

	const selectService = (serviceName: string) => {
		router.push(`/${serviceName}`)
	}

	return (
		<div className="fixed inset-y-0 z-50 flex flex-col lg:w-72">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
				<div className="flex h-16 shrink-0 items-center">
					<Logo className="w-48" />
				</div>
				<nav className="flex flex-1 flex-col">
					<ul role="list" className="flex flex-1 flex-col gap-y-7">
						<li className="border-b border-slate-100 pb-4">
							{services.length > 0 ? (
								<>
									{currentService && (
										<div className="text-sm font-semibold leading-6 text-slate-500">
											Current Service
										</div>
									)}
									<ListItemButton
										onClick={() => setOpenServices(!openServices)}
										className="rounded-lg bg-slate-100"
									>
										{currentService ? (
											<>
												<ListItemIcon>
													{currentService.avatar_url ? (
														<Image
															src={currentService.avatar_url}
															alt={currentService.name}
															width={24}
															height={24}
															className="rounded-full"
														/>
													) : (
														<span className="border-nano text-nano flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white text-[0.625rem] font-medium">
															{currentService.name[0]}
														</span>
													)}
												</ListItemIcon>
												<ListItemText primary={currentService.name} />
											</>
										) : (
											<>
												<ListItemText primary={'Select a service'} />
											</>
										)}
										{openServices ? <ChevronUpIcon /> : <ChevronDownIcon />}
									</ListItemButton>
									<Collapse in={openServices} timeout="auto" unmountOnExit>
										<List component="div" disablePadding>
											{services?.map(
												service =>
													service.id !== currentService?.id && (
														<ListItemButton
															key={service.id}
															onClick={() => selectService(service.name)}
														>
															<ListItemIcon>
																{service.avatar_url ? (
																	<Image
																		src={service.avatar_url}
																		alt={service.name}
																		width={24}
																		height={24}
																		className="rounded-full"
																	/>
																) : (
																	<span
																		className={clsx(
																			service.id === service.id
																				? 'border-nano text-nano'
																				: 'group-hover:border-nano group-hover:text-nano border-slate-200 text-slate-400',
																			'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white text-[0.625rem] font-medium',
																		)}
																	>
																		{service.name[0]}
																	</span>
																)}
															</ListItemIcon>
															<ListItemText primary={service.name} />
														</ListItemButton>
													),
											)}
										</List>
									</Collapse>
								</>
							) : (
								<>
									<div className="mb-2 text-xs font-semibold leading-6 text-slate-400">
										No services found
									</div>
									<Link href={'/services/new'}>
										<Button variant="outline">Create a Service</Button>
									</Link>
								</>
							)}
						</li>
						<li className="relative">
							<ul
								role="list"
								className={clsx(
									'-mx-2 space-y-2',
									!currentService && 'blur-[2px]',
								)}
							>
								{serviceNavigation.map(item => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={clsx(
												item.current
													? 'border-slatel-100 text-nano border bg-slate-50'
													: 'hover:text-nano text-slate-600 hover:bg-slate-50',
												'group flex items-center gap-x-4 rounded-md p-3 text-base font-semibold leading-6',
											)}
										>
											<item.icon
												className={clsx(
													item.current
														? 'text-nano'
														: 'group-hover:text-nano text-slate-400',
													'h-6 w-6 shrink-0',
												)}
												aria-hidden="true"
											/>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
							{!currentService && (
								<div className="absolute inset-0 -mx-2 flex items-center justify-center bg-white opacity-20" />
							)}
						</li>
						<li className="mt-auto">
							<ul role="list" className="-mx-2 space-y-2">
								{defaultNavigation.map(item => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={clsx(
												item.current
													? 'border-slatel-100 text-nano border bg-slate-50'
													: 'hover:text-nano text-slate-700 hover:bg-slate-50',
												'group flex gap-x-3 rounded-md p-3 text-base font-semibold leading-6',
											)}
										>
											<item.icon
												className={clsx(
													item.current
														? 'text-nano'
														: 'group-hover:text-nano text-slate-400',
													'h-6 w-6 shrink-0',
												)}
												aria-hidden="true"
											/>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	)
}

export function TransitionSidebar({ services }: SidebarProps) {
	const { sidebarOpen, setSidebarOpen } = usePreferences()

	return (
		<>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50 lg:hidden"
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-slate-900/80" />
					</Transition.Child>

					<div className="fixed inset-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
										<button
											type="button"
											className="-m-2.5 p-2.5"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XIcon
												className="h-6 w-6 text-white"
												aria-hidden="true"
											/>
										</button>
									</div>
								</Transition.Child>
								<Sidebar services={services} />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<div className="hidden lg:block">
				<Sidebar services={services} />
			</div>
		</>
	)
}
