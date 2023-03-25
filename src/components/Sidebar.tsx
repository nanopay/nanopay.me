import api from '@/services/api'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Logo } from './Logo'
import { Project } from '@/types/projects'
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

	const [currentProject, setCurrentProject] = useState<null | Project>(null)
	const [openProjects, setOpenProjects] = useState<boolean>(false)

	const { data: projects, isLoading: projectsLoading } = useQuery(
		'projects',
		() => api.projects.list().then(res => res.data),
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

	const projectNavigation = [
		{
			name: 'Dashboard',
			href: `/projects/${currentProject?.name}`,
			icon: HomeIcon,
			current: router.pathname === '/projects/[projectName]',
		},
		{
			name: 'Invoices',
			href: `/projects/${currentProject?.name}/invoices`,
			icon: BanknotesIcon,
			current: router.pathname === '/projects/[projectName]/invoices',
		},
		{
			name: 'Webhooks',
			href: `/projects/${currentProject?.name}/webhooks`,
			icon: Webhook,
			current: router.pathname === '/projects/[projectName]/webhooks',
		},
		{
			name: 'Api Keys',
			href: `/projects/${currentProject?.name}/keys`,
			icon: KeyIcon,
			current: router.pathname === '/projects/[projectName]/keys',
		},
		{
			name: 'Settings',
			href: `/projects/${currentProject?.name}/settings`,
			icon: Cog6ToothIcon,
			current: router.pathname === '/projects/[projectName]/settings',
		},
	]

	useEffect(() => {
		if (router.query.projectName) {
			setCurrentProject(
				projects?.find(project => project.name === router.query.projectName) ||
					null,
			)
		}
	}, [projects])

	const selectProject = (projectName: string) => {
		router.push(`/projects/${projectName}`)
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
							{projectsLoading || !projects ? (
								<div>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Current Project
									</div>
									<Loading className="h-12 mx-auto mt-2" />
								</div>
							) : projects.length > 0 ? (
								<>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Current Project
									</div>
									<ListItemButton
										onClick={() => setOpenProjects(!openProjects)}
										className="bg-slate-100 rounded-lg"
									>
										{currentProject ? (
											<>
												<ListItemIcon>
													{currentProject.avatar_url ? (
														<Image
															src={currentProject.avatar_url}
															alt={currentProject.name}
															width={24}
															height={24}
															className="rounded-full"
														/>
													) : (
														<span className="text-nano border-nano flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium bg-white">
															{currentProject.name[0]}
														</span>
													)}
												</ListItemIcon>
												<ListItemText primary={currentProject.name} />
											</>
										) : (
											<>
												<ListItemText primary={'Select a project'} />
											</>
										)}
										{openProjects ? <ExpandLess /> : <ExpandMore />}
									</ListItemButton>
									<Collapse in={openProjects} timeout="auto" unmountOnExit>
										<List component="div" disablePadding>
											{projects?.map(
												project =>
													project.id !== currentProject?.id && (
														<ListItemButton
															key={project.id}
															onClick={() => selectProject(project.name)}
														>
															<ListItemIcon>
																{project.avatar_url ? (
																	<Image
																		src={project.avatar_url}
																		alt={project.name}
																		width={24}
																		height={24}
																		className="rounded-full"
																	/>
																) : (
																	<span
																		className={clsx(
																			project.id === project.id
																				? 'text-nano border-nano'
																				: 'text-gray-400 border-gray-200 group-hover:border-nano group-hover:text-nano',
																			'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium bg-white',
																		)}
																	>
																		{project.name[0]}
																	</span>
																)}
															</ListItemIcon>
															<ListItemText primary={project.name} />
														</ListItemButton>
													),
											)}
										</List>
									</Collapse>
								</>
							) : (
								<>
									<div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
										No projects found
									</div>
									<MButton
										variant="outlined"
										color="primary"
										onClick={() => router.push('/projects/create')}
									>
										Create a project
									</MButton>
								</>
							)}
						</li>
						<li>
							<ul role="list" className="-mx-2 space-y-1">
								{projectNavigation.map(item => (
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
