import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import xnoHeart from '@/images/xno-heart.svg'
import QrCodeBorder from './QrCodeBorder'
import { CONTACT_EMAIL } from '@/core/constants'

export function Footer() {
	return (
		<footer className="mt-8 border-t border-slate-200">
			<Container>
				<div className="flex flex-col items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-8">
					<div>
						<div className="flex items-center text-slate-900">
							<Logomark className="h-auto w-12 flex-none fill-blue-500" />
							<div className="ml-4">
								<p className="text-base font-semibold">NanoPay.me</p>
								<p className="text-sm">Pay and receive payments with Nano.</p>
							</div>
						</div>
						<nav className="mt-11 flex gap-8">
							<NavLinks />
						</nav>
					</div>
					<div className="hover:bg-nano/10 group relative -mx-4 flex items-center self-stretch p-4 transition-colors sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
						<div className="relative flex h-20 w-20 flex-none items-center justify-center">
							<QrCodeBorder className="group-hover:stroke-nano absolute inset-0 h-full w-full stroke-slate-300 transition-colors" />
							<Image src={xnoHeart} alt="XNO" className="h-14 w-14" />
						</div>
						<div className="ml-8 lg:w-64">
							<p className="text-base font-semibold text-slate-900">
								<Link href="#">
									<span className="absolute inset-0 sm:rounded-2xl" />
									Donate with Nano
								</Link>
							</p>
							<p className="mt-1 text-sm text-slate-700">
								Donate with NanoPay.me
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center border-t border-slate-200 py-8 md:flex-row-reverse md:justify-between md:pt-6">
					<Link
						href={`mailto:${CONTACT_EMAIL}`}
						className="text-sm text-slate-500"
					>
						{CONTACT_EMAIL}
					</Link>
					<p className="mt-6 text-sm text-slate-500 md:mt-0">
						&copy; Copyright {new Date().getFullYear()}. All rights reserved.
					</p>
				</div>
			</Container>
		</footer>
	)
}
