'use client'

import { GlobeIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/Button'
import { ServiceAvatar } from '@/components/ServiceAvatar'
import { deleteService } from './actions'
import { Service } from '@/services/client'

export interface SettingsProps {
	service: Service
}

export function Settings({ service }: SettingsProps) {
	return (
		<header className="rounded-lg bg-white shadow">
			<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
				<div className="py-6 md:flex md:items-center md:justify-between">
					<div className="min-w-0 flex-1">
						{/* Service Profile */}
						<div className="flex items-center">
							<div className="hidden sm:flex">
								<ServiceAvatar
									id={service.id}
									size={64}
									src={service.avatar_url}
									alt={service.display_name}
								/>
							</div>
							<div>
								<div className="flex items-center">
									<div className="sm:hidden">
										<ServiceAvatar
											id={service.id}
											size={64}
											src={service.avatar_url}
											alt={service.display_name}
										/>
									</div>
									<h1 className="ml-3 text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:leading-9">
										{service.name}
									</h1>
								</div>
								<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
									<dt className="sr-only">Website</dt>
									{service.website && (
										<dd className="sm:mr-6">
											<a
												href={service.website}
												className="hover:text-nano flex items-center truncate text-sm font-medium text-slate-500"
											>
												<GlobeIcon
													className="mr-1 h-5 w-5 flex-shrink-0"
													aria-hidden="true"
												/>
												{service.website}
											</a>
										</dd>
									)}
									{service.description && (
										<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
											{service.description.slice(0, 60)}
											{service.description.length > 60 && '...'}
										</dd>
									)}
								</dl>
							</div>
						</div>
					</div>
					<div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
						<Button
							variant="destructive"
							color="nano"
							onClick={() => deleteService(service.name)}
						>
							<TrashIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
							Delete
						</Button>
					</div>
				</div>
			</div>
		</header>
	)
}
