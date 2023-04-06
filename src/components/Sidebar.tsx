import api from '@/services/api'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
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
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MButton from './MButton'
import Loading from './Loading'

export default function Sidebar() {
	const router = useRouter()

	const [currentService, setCurrentService] = useState<null | Service>(null)
	const [openServices, setOpenServices] = useState<boolean>(false)

	const { data: services, isLoading: servicesLoading } = useQuery(
		'services',
		() => api.services.list().then(res => res.data),
	)

	const defaultNavigation = [
		{
			name: 'Home',
			href: '/home',
			icon: HomeIcon,
			current: router.pathname === '/home',
		},
		{
			name: 'Profile',
			href: '/profile',
			icon: UserIcon,
			current: router.pathname === '/profile',
		},
	]

	const serviceNavigation = [
		{
			name: 'Dashboard',
			href: `/services/${currentService?.name}`,
			icon: HomeIcon,
			current: router.pathname === '/services/[serviceName]',
		},
		{
			name: 'Invoices',
			href: `/services/${currentService?.name}/invoices`,
			icon: BanknotesIcon,
			current: router.pathname === '/services/[serviceName]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/services/${currentService?.name}/webhooks`,
			icon: Webhook,
			current: router.pathname === '/services/[serviceName]/webhooks',
		},
		{
			name: 'Api Keys',
			href: `/services/${currentService?.name}/keys`,
			icon: KeyIcon,
			current: router.pathname === '/services/[serviceName]/keys',
		},
		{
			name: 'Settings',
			href: `/services/${currentService?.name}/settings`,
			icon: Cog6ToothIcon,
			current: router.pathname === '/services/[serviceName]/settings',
		},
	]

	useEffect(() => {
		if (router.query.serviceName) {
			setCurrentService(
				services?.find(service => service.name === router.query.serviceName) ||
					null,
			)
		}
	}, [services])

	const selectService = (serviceName: string) => {
		router.push(`/services/${serviceName}`)
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
							{servicesLoading || !services ? (
								<div>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Current Service
									</div>
									<Loading className="h-12 mx-auto mt-2" />
								</div>
							) : services.length > 0 ? (
								<>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Current Service
									</div>
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
									<MButton
										variant="outlined"
										color="primary"
										onClick={() => router.push('/services/create')}
									>
										Create a service
									</MButton>
								</>
							)}
						</li>
						<li className="relative">
							<ul role="list" className="-mx-2 space-y-1">
								{serviceNavigation.map(item => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={clsx(
												item.current
													? 'bg-slate-50 border border-slatel-100 text-nano'
													: 'text-gray-700 hover:text-nano hover:bg-gray-50',
												'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
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
							{(servicesLoading || !services) && (
								<div className="-mx-2 absolute inset-0 flex items-center justify-center bg-white opacity-50" />
							)}
						</li>
						<li className="mt-auto">
							<ul role="list" className="-mx-2 space-y-1">
								{defaultNavigation.map(item => (
									<li key={item.name}>
										<Link
											href={item.href}
											className={clsx(
												item.current
													? 'bg-slate-50 border border-slatel-100 text-nano'
													: 'text-gray-700 hover:text-nano hover:bg-gray-50',
												'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
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
