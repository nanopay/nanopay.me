'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

export const links = [
	['Demo', '/demo'],
	['FAQs', '/#faqs'],
	['API', '/#api'],
	[
		'Donate',
		'https://github.com/nanopay/nanopay.me?tab=readme-ov-file#donate-%D3%BF',
	],
	['Github', 'https://github.com/nanopay/nanopay.me'],
]

export function NavLinks() {
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
						'relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors delay-150 hover:text-slate-900',
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
