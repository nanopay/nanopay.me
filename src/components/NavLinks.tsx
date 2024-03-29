'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const links = [
	['FAQs', '/#faqs'],
	['API', '/#api'],
	['Donate', '/#donate'],
]

export function NavLinks() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	return (
		<>
			{links.map(([label, href], index) => (
				<Link
					key={label}
					href={href}
					className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors delay-150 hover:text-slate-900"
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
