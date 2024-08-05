import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import xnoHeart from '@/images/xno-heart.svg'
import QrCodeBorder from './QrCodeBorder'
import { CONTACT_EMAIL } from '@/core/constants'
import { cn } from '@/lib/cn'

export function Footer({
	theme = 'light',
	className,
	...props
}: { theme?: 'light' | 'dark' } & React.HTMLAttributes<HTMLElement>) {
	return (
		<footer
			className={cn(
				'mt-8 border border-t border-slate-200 bg-white',
				theme === 'dark' && 'dark border-transparent bg-slate-900',
				className,
			)}
			{...props}
		>
			<Container>
				<div className="flex flex-col items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-8">
					<div>
						<div className="flex items-center text-slate-800 dark:text-slate-200">
							<Logomark
								theme={theme}
								className="h-auto w-12 flex-none fill-blue-500"
							/>
							<div className="ml-4">
								<p className="text-base font-semibold">NanoPay.me</p>
								<p className="text-sm">Pay and get paid with Nano.</p>
							</div>
						</div>
						<nav className="mt-11 flex gap-8">
							<NavLinks theme={theme} />
						</nav>
					</div>
					<div className="hover:bg-nano/10 group relative -mx-4 flex items-center self-stretch p-4 transition-colors sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
						<div className="relative flex h-20 w-20 flex-none items-center justify-center">
							<QrCodeBorder className="group-hover:stroke-nano absolute inset-0 h-full w-full stroke-slate-300 transition-colors" />
							<Image src={xnoHeart} alt="XNO" className="h-14 w-14" />
						</div>
						<div className="ml-8 lg:w-64">
							<p className="text-base font-semibold text-slate-800 dark:text-slate-200">
								<Link href="#">
									<span className="absolute inset-0 sm:rounded-2xl" />
									Donate with Nano
								</Link>
							</p>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								Donate with NanoPay.me
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center border-t border-slate-200 py-8 text-sm text-slate-800 md:flex-row-reverse md:justify-between md:pt-6 dark:border-slate-700 dark:text-slate-400">
					<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
					<p className="mt-6 md:mt-0">
						&copy; Copyright {new Date().getFullYear()}. All rights reserved.
					</p>
				</div>
			</Container>
		</footer>
	)
}
