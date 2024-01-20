'use client'

import { Dialog, Transition } from '@headlessui/react'

import { Fragment, useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Service } from '@/types/services'
import Image from 'next/image'
import { ExpandLess, ExpandMore, Webhook } from '@mui/icons-material'
import clsx from 'clsx'
import {
	Collapse,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material'
import {
	BanknotesIcon,
	Cog6ToothIcon,
	HomeIcon,
	KeyIcon,
	UserIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import MButton from './MButton'
import { usePreferences } from '@/contexts/PreferencesProvider'

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
			icon: UserIcon,
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
			icon: BanknotesIcon,
			current: pathname === '/[serviceName]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/${currentService?.name}/hooks`,
			icon: Webhook,
			current: pathname === '/[serviceName]/hooks',
		},
		{
			name: 'Api Keys',
			href: `/${currentService?.name}/keys`,
			icon: KeyIcon,
			current: pathname === '/[serviceName]/keys',
		},
		{
			name: 'Settings',
			href: `/${currentService?.name}/settings`,
			icon: Cog6ToothIcon,
			current: pathname === '/[serviceName]/settings',
		},
	]

	const selectService = (serviceName: string) => {
		router.push(`/${serviceName}`)
	}

	return (
		<div className="fixed inset-y-0 z-50 flex lg:w-72 flex-col">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
				<div className="flex h-16 shrink-0 items-center">
					<Logo className="w-48" />
				</div>
				<nav className="flex flex-1 flex-col">
					<ul role="list" className="flex flex-1 flex-col gap-y-7">
						<li className="border-b border-gray-100 pb-4">
							{services.length > 0 ? (
								<>
									{currentService && (
										<div className="text-sm font-semibold leading-6 text-gray-500">
											Current Service
										</div>
									)}
									<ListItemButton
										onClick={() => setOpenServices(!openServices)}
										className="bg-slate-100 rounded-lg"
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
														<span className="text-nano border-nano flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium bg-white">
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
										{openServices ? <ExpandLess /> : <ExpandMore />}
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
																				? 'text-nano border-nano'
																				: 'text-gray-400 border-gray-200 group-hover:border-nano group-hover:text-nano',
																			'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium bg-white',
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
									<div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
										No services found
									</div>
									<Link href={'/services/new'}>
										<MButton variant="outlined" color="primary">
											Create a service
										</MButton>
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
													? 'bg-slate-50 border border-slatel-100 text-nano'
													: 'text-gray-600 hover:text-nano hover:bg-gray-50',
												'group flex gap-x-4 rounded-md p-3 text-base items-center leading-6 font-semibold',
											)}
										>
											<item.icon
												className={clsx(
													item.current
														? 'text-nano'
														: 'text-gray-400 group-hover:text-nano',
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
								<div className="-mx-2 absolute inset-0 flex items-center justify-center bg-white opacity-20" />
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
													? 'bg-slate-50 border border-slatel-100 text-nano'
													: 'text-gray-700 hover:text-nano hover:bg-gray-50',
												'group flex gap-x-3 rounded-md p-3 text-base leading-6 font-semibold',
											)}
										>
											<item.icon
												className={clsx(
													item.current
														? 'text-nano'
														: 'text-gray-400 group-hover:text-nano',
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
						<div className="fixed inset-0 bg-gray-900/80" />
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
									<div className="absolute top-0 left-full flex w-16 justify-center pt-5">
										<button
											type="button"
											className="-m-2.5 p-2.5"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon
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
