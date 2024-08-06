import { LinkIcon } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ ...props }) => (
			<HeadingLink id={props.id} children={<h1 {...props} />} />
		),
		h2: ({ ...props }) => (
			<HeadingLink id={props.id} children={<h2 {...props} />} />
		),
		h3: ({ ...props }) => (
			<HeadingLink id={props.id} children={<h3 {...props} />} />
		),
		h4: ({ ...props }) => (
			<HeadingLink id={props.id} children={<h4 {...props} />} />
		),
		...components,
	}
}

function HeadingLink({ id, children }: { id?: string; children: ReactNode }) {
	return (
		<a href={`#${id}`} className="text-sm no-underline">
			{children}
		</a>
	)
}
