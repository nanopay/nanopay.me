import { LinkIcon } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
		h2: ({ children, ...props }) => (
			<h2 {...props}>
				<HeadingLink id={props.id}>{children}</HeadingLink>
			</h2>
		),
		h3: ({ children, ...props }) => (
			<h3 {...props}>
				<HeadingLink id={props.id}>{children}</HeadingLink>
			</h3>
		),
		h4: ({ children, ...props }) => (
			<h4 {...props}>
				<HeadingLink id={props.id}>{children}</HeadingLink>
			</h4>
		),
		...components,
	}
}

function HeadingLink({ id, children }: { id?: string; children: ReactNode }) {
	return (
		<a
			href={`#${id}`}
			className="border-dotted border-slate-600 no-underline hover:border-b-2"
		>
			{children}
			<LinkIcon
				size={16}
				className="ml-2 inline-block text-slate-600 "
				aria-hidden="true"
			/>
		</a>
	)
}
