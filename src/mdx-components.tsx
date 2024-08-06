import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ children, ...props }) => (
			<HeadingLink id={props.id}>
				<h1 {...props}>{children}</h1>
			</HeadingLink>
		),
		h2: ({ children, ...props }) => (
			<HeadingLink id={props.id}>
				<h2 {...props}>{children}</h2>
			</HeadingLink>
		),
		h3: ({ children, ...props }) => (
			<HeadingLink id={props.id}>
				<h3 {...props}>{children}</h3>
			</HeadingLink>
		),
		h4: ({ children, ...props }) => (
			<HeadingLink id={props.id}>
				<h4 {...props}>{children}</h4>
			</HeadingLink>
		),
		...components,
	}
}

function HeadingLink({ id, children }: { id?: string; children: ReactNode }) {
	return (
		<a href={`#${id}`} className="no-underline">
			{children}
		</a>
	)
}
