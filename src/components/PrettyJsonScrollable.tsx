'use client'

import { useMemo, useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/cn'
import { CopyCheckIcon, CopyIcon } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip'
import { ScrollAreaProps } from '@radix-ui/react-scroll-area'

export function PrettyJsonScrollable({
	json,
	allowCopy = true,
	preClassName,
	...props
}: ScrollAreaProps & {
	json: string | Record<string, unknown>
	allowCopy?: boolean
	preClassName?: string
}) {
	const [copied, setCopied] = useState(false)

	const stringJson =
		typeof json === 'string' ? json : JSON.stringify(json, null, 2)

	const highlighted = useMemo(() => {
		// Replace special characters to prevent XSS
		let safeJson = stringJson
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')

		return safeJson.replace(
			/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
			match => {
				let className = 'text-orange-500' // Default for numbers

				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						className = 'text-green-600' // Keys
					} else {
						className = 'text-sky-600' // Strings
					}
				} else if (/true|false/.test(match)) {
					className = 'text-blue-500' // Booleans
				} else if (/null/.test(match)) {
					className = 'text-pink-500' // Nulls
				}

				return `<span class="${className}">${match}</span>`
			},
		)
	}, [stringJson])

	const handleCopy = () => {
		const stringJson =
			typeof json === 'string' ? json : JSON.stringify(json, null, 2)
		navigator.clipboard.writeText(stringJson)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<ScrollArea
			{...props}
			className={cn(
				'group relative flex max-h-80 flex-col rounded-md border border-slate-200 p-4',
				props.className,
			)}
		>
			<pre
				className={cn(
					'whitespace-pre-wrap break-all text-slate-600',
					preClassName,
				)}
				dangerouslySetInnerHTML={{ __html: highlighted }}
			/>

			{allowCopy && (
				<TooltipProvider>
					<Tooltip open={copied ? true : undefined} delayDuration={200}>
						<TooltipTrigger asChild>
							<button
								onClick={handleCopy}
								className={cn(
									'bg-nano absolute right-4 top-3 hidden rounded-md p-1.5 text-white transition-colors focus-visible:outline-hidden focus-visible:ring-0 active:scale-95 group-hover:block',
									copied && 'bg-green-600',
								)}
								aria-label="Copy JSON"
								disabled={copied}
								autoFocus={false}
							>
								{copied ? (
									<CopyCheckIcon className="h-3 w-3" />
								) : (
									<CopyIcon className="h-3 w-3" />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className="text-xs">
							{copied ? 'Copied!' : 'Copy JSON'}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</ScrollArea>
	)
}
