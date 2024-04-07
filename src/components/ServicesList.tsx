import { Service } from '@/types/services'
import Link from 'next/link'
import { DefaultAvatar } from './DefaultAvatar'

export default function ServicesList({ services }: { services: Service[] }) {
	return (
		<div className="animate-fade-in divide-y divide-slate-200 overflow-hidden rounded-lg bg-slate-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
			{services?.map((service, index) => (
				<div
					key={index}
					className="focus-within:ring-nano/60 group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset"
				>
					<div>
						<span className="inline-flex rounded-full bg-sky-50 p-3 text-sky-700 ring-4 ring-white">
							<DefaultAvatar
								id={service.id}
								src={service.avatar_url}
								size={40}
								alt={service.display_name}
							/>
						</span>
					</div>
					<div className="mt-8">
						<h3 className="text-lg font-medium">
							<Link href={`/${service.name}`} className="focus:outline-none">
								{/* Extend touch target to entire panel */}
								<span className="absolute inset-0" aria-hidden="true"></span>
								{service.name}
							</Link>
						</h3>
						<p className="mt-2 text-sm text-slate-500">{service.description}</p>
					</div>
					<span
						className="pointer-events-none absolute right-6 top-6 text-slate-300 group-hover:text-slate-400"
						aria-hidden="true"
					>
						<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"></path>
						</svg>
					</span>
				</div>
			))}
		</div>
	)
}
