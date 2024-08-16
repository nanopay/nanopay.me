'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { DONATE_URL } from '@/core/constants'

export const links = [
	['Demo', '/demo'],
	['FAQs', '/#faqs'],
	['API', '/api'],
	['Donate', DONATE_URL],
]

export function NavLinks({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
	const pathname = usePathname()

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	return (
		<>
			{links.map(([label, href], index) => (
				<Link
					key={label}
					href={href}
					target={href.startsWith('http') ? '_blank' : undefined}
					className={cn(
						cn(
							'relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors delay-150',
							theme === 'light'
								? 'text-slate-800 hover:text-slate-900'
								: 'text-slate-300 hover:text-slate-200',
						),
						pathname === href && 'bg-nano text-white',
					)}
					onMouseEnter={() => setHoveredIndex(index)}
					onMouseLeave={() => setHoveredIndex(null)}
				>
					<AnimatePresence>
						{hoveredIndex === index && (
							<motion.span
								className="bg-nano/20 absolute inset-0 rounded-lg"
								layoutId="hoverBackground"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { duration: 0.15 } }}
								exit={{
									opacity: 0,
									transition: { duration: 0.15, delay: 0.2 },
								}}
							/>
						)}
					</AnimatePresence>
					<span className="relative z-10">{label}</span>
				</Link>
			))}
		</>
	)
}
