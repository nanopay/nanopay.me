import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import xnoHeart from '@/images/xno-heart.svg'
import QrCodeBorder from './QrCodeBorder'
import { CONTACT_EMAIL, DONATE_URL, GITHUB_URL, X_URL } from '@/core/constants'
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
				<div className="flex flex-col items-center justify-between gap-y-8 pb-6 pt-8 sm:items-start lg:flex-row lg:items-center lg:pb-8">
					<div className="flex flex-col items-center sm:items-start">
						<div className="flex w-fit items-center gap-6">
							<a href={GITHUB_URL} target="_blank" className="group">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="28"
									height="28"
									viewBox="0 0 24 24"
									className="group-hover:fill-primary transition-color fill-white duration-200"
								>
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
							</a>
							<a href={X_URL} target="_blank" className="group">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="28"
									height="28"
									version="1.1"
									viewBox="0 0 300 300.251"
									className="group-hover:fill-primary transition-color fill-white duration-200"
								>
									<path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
								</svg>
							</a>
						</div>
						<nav className="mt-6 flex gap-8">
							<NavLinks theme={theme} />
						</nav>
					</div>
					<div className="hover:bg-nano/10 group relative flex w-fit items-center rounded-2xl p-4 transition-colors sm:self-auto lg:self-auto">
						<div className="relative flex h-14 w-14 flex-none items-center justify-center">
							<QrCodeBorder className="group-hover:stroke-nano absolute inset-0 h-full w-full stroke-slate-300 transition-colors" />
							<Image src={xnoHeart} alt="XNO" className="h-10 w-10" />
						</div>
						<div className="ml-8 lg:w-64">
							<p className="text-base font-semibold text-slate-800 dark:text-slate-200">
								<Link href={DONATE_URL}>
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
				<div className="flex flex-col items-center border-t border-slate-200 py-8 text-base text-slate-800 md:flex-row-reverse md:justify-between md:pt-6 dark:border-slate-700 dark:text-slate-400">
					<a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
						{CONTACT_EMAIL}
					</a>
					<p className="mt-6 flex md:mt-0">
						<Logomark className="mr-2 h-auto w-5" theme={theme} /> &copy;{' '}
						{new Date().getFullYear()}
					</p>
				</div>
			</Container>
		</footer>
	)
}
