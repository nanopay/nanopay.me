import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import xnoHeart from '@/images/xno-heart.svg'

function QrCodeBorder(props: React.ComponentProps<'svg'>) {
	return (
		<svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
			<path
				d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	)
}

export function Footer() {
	return (
		<footer className="border-t border-gray-200">
			<Container>
				<div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
					<div>
						<div className="flex items-center text-gray-900">
							<Logomark className="w-12 h-auto flex-none fill-blue-500" />
							<div className="ml-4">
								<p className="text-base font-semibold">NanoPay.me</p>
								<p className="text-sm">Pay and receive payments with Nano.</p>
							</div>
						</div>
						<nav className="mt-11 flex gap-8">
							<NavLinks />
						</nav>
					</div>
					<div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
						<div className="relative flex h-20 w-20 flex-none items-center justify-center">
							<QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-blue-500" />
							<Image src={xnoHeart} alt="XNO" className="w-14 h-14" />
						</div>
						<div className="ml-8 lg:w-64">
							<p className="text-base font-semibold text-gray-900">
								<Link href="#">
									<span className="absolute inset-0 sm:rounded-2xl" />
									Donate with Nano
								</Link>
							</p>
							<p className="mt-1 text-sm text-gray-700">
								Donate with NanoPay.me
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center border-t border-gray-200 pt-8 pb-12 md:flex-row-reverse md:justify-between md:pt-6">
					<Link
						href="mailto:hello@nanopay.me"
						className="text-sm text-gray-500"
					>
						hello@nanopay.me
					</Link>
					<p className="mt-6 text-sm text-gray-500 md:mt-0">
						&copy; Copyright {new Date().getFullYear()}. All rights reserved.
					</p>
				</div>
			</Container>
		</footer>
	)
}
