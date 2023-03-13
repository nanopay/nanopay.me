import { PROJECT_AVATAR_PLACEHOLDER } from '@/constants'
import { Project } from '@/types/projects'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsList({ projects }: { projects: Project[] }) {
	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-slate-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 animate-fade-in">
			{projects?.map((project, index) => (
				<div
					key={index}
					className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-nano/60"
				>
					<div>
						<span className="inline-flex rounded-full p-3 bg-sky-50 text-sky-700 ring-4 ring-white">
							{
								<Image
									className="rounded-full"
									src={project.avatar_url || PROJECT_AVATAR_PLACEHOLDER}
									alt={project.name}
									width={40}
									height={40}
								/>
							}
						</span>
					</div>
					<div className="mt-8">
						<h3 className="text-lg font-medium">
							<Link
								href={`dashboard/projects/${project.name}`}
								className="focus:outline-none"
							>
								{/* Extend touch target to entire panel */}
								<span className="absolute inset-0" aria-hidden="true"></span>
								{project.name}
							</Link>
						</h3>
						<p className="mt-2 text-sm text-gray-500">{project.description}</p>
					</div>
					<span
						className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
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
