import { Dialog, Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Logo } from './Logo'
import Image from 'next/image'
import { UserProfile } from '@/types/users'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { Footer } from './Footer'

const userNavigation = [
	{ name: 'Your profile', href: '/profile' },
	{ name: 'Logout', href: '/logout' },
]

interface SidebarProps {
	user: UserProfile
	children: React.ReactNode
	showFooter?: boolean
}

export default function Layout({
	user,
	children,
	showFooter = false,
}: SidebarProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="w-full min-h-screen flex flex-col">
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
								<Sidebar />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<div className="hidden lg:block">
				<Sidebar />
			</div>

			<div className="lg:pl-72 flex flex-col flex-1">
				<div className="w-full sticky top-0 z-40 lg:mx-auto">
					<div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 lg:shadow-none">
						<button
							type="button"
							className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>

						{/* Separator */}
						<div
							className="h-6 w-px bg-gray-200 lg:hidden"
							aria-hidden="true"
						/>

						<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
							<div className="flex flex-1 items-center">
								<Logo className="sm:hidden w-36" />
							</div>
							<div className="flex items-center gap-x-4 lg:gap-x-6">
								<button
									type="button"
									className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
								>
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>

								{/* Separator */}
								<div
									className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
									aria-hidden="true"
								/>

								{/* Profile dropdown */}
								<Menu as="div" className="relative">
									<Menu.Button className="-m-1.5 flex items-center p-1.5">
										<span className="sr-only">Open user menu</span>
										<Image
											width={40}
											height={40}
											className="rounded-full bg-gray-50"
											src={user.avatar_url}
											alt=""
										/>
										<span className="hidden lg:flex lg:items-center">
											<span
												className="ml-4 text-sm font-semibold leading-6 text-gray-900"
												aria-hidden="true"
											>
												{user.name}
											</span>
											<ChevronDownIcon
												className="ml-2 h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
										</span>
									</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
											{userNavigation.map(item => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<Link
															href={item.href}
															className={clsx(
																active ? 'bg-gray-50' : '',
																'block px-3 py-1 text-sm leading-6 text-gray-900',
															)}
														>
															{item.name}
														</Link>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>
				</div>

				<main className="flex flex-col w-full flex-1 py-8 px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
					{children}
				</main>

				{showFooter && <Footer />}
			</div>
		</div>
	)
}
