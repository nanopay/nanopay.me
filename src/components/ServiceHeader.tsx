import { Button } from '@/components/Button'
import { Service } from '@/core/client'
import { GlobeIcon, MailIcon, PlusIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { ServiceAvatarEditable } from './ServiceAvatarEditable'

export default function ServiceHeader({ service }: { service: Service }) {
	return (
		<header className="rounded-lg border border-slate-200 bg-white">
			<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
				<div className="py-6 md:flex md:items-center md:justify-between">
					<div className="min-w-0 flex-1">
						{/* Service Profile */}
						<div className="flex items-center">
							<div className="hidden sm:flex">
								<ServiceAvatarEditable
									id={service.id}
									size={80}
									src={service.avatar_url}
									alt={service.name}
								/>
							</div>
							<div>
								<div className="flex items-center">
									<div className="sm:hidden">
										<ServiceAvatarEditable
											id={service.id}
											size={64}
											src={service.avatar_url}
											alt={service.name}
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
													className="mr-1 h-5 w-5 shrink-0"
													aria-hidden="true"
												/>
												{service.website}
											</a>
										</dd>
									)}
									{service.contact_email ? (
										<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
											<MailIcon
												className="mr-1 h-5 w-5 shrink-0"
												aria-hidden="true"
											/>
											{service.contact_email.slice(0, 60)}
											{service.contact_email.length > 60 && '...'}
										</dd>
									) : (
										<dd className="flex items-center text-sm font-medium text-slate-500 sm:mr-6">
											<MailIcon
												className="mr-1 h-5 w-5 shrink-0"
												aria-hidden="true"
											/>
											No contact email
										</dd>
									)}
								</dl>
							</div>
						</div>
					</div>
					<div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
						<Button variant="outline" color="nano" asChild>
							<Link href={`/${service.slug}/settings`}>
								<SettingsIcon
									className="-ml-1 mr-2 h-4 w-4"
									aria-hidden="true"
								/>
								Settings
							</Link>
						</Button>
						<Link href={`/${service.slug}/invoices/new`}>
							<Button color="nano">
								<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
								Create Invoice
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
