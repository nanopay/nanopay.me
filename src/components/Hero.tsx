import { useId } from 'react'
import Image from 'next/image'

import { AppScreen } from '@/components/AppScreen'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { PhoneFrame } from '@/components/PhoneFrame'
import logoXno from '@/images/logos/nano-xno.svg'
import { Logo } from './Logo'
import Link from 'next/link'
import {
	CircleEllipsisIcon,
	CopyIcon,
	PlayIcon,
	QrCodeIcon,
	XCircleIcon,
} from 'lucide-react'
import { Nunito } from 'next/font/google'
import clsx from 'clsx'

const nunito = Nunito({
	weight: ['500'],
	subsets: ['latin'],
})

function BackgroundIllustration(props: React.ComponentProps<'div'>) {
	let id = useId()

	return (
		<div {...props}>
			<svg
				viewBox="0 0 1026 1026"
				fill="none"
				aria-hidden="true"
				className="animate-spin-slow absolute inset-0 h-full w-full"
			>
				<path
					d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
					stroke="#D4D4D4"
					strokeOpacity="0.7"
				/>
				<path
					d="M513 1025C230.23 1025 1 795.77 1 513"
					stroke={`url(#${id}-gradient-1)`}
					strokeLinecap="round"
				/>
				<defs>
					<linearGradient
						id={`${id}-gradient-1`}
						x1="1"
						y1="513"
						x2="1"
						y2="1025"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#209CE9" />
						<stop offset="1" stopColor="#209CE9" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
			<svg
				viewBox="0 0 1026 1026"
				fill="none"
				aria-hidden="true"
				className="animate-spin-reverse-slower absolute inset-0 h-full w-full"
			>
				<path
					d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
					stroke="#D4D4D4"
					strokeOpacity="0.7"
				/>
				<path
					d="M913 513c0 220.914-179.086 400-400 400"
					stroke={`url(#${id}-gradient-2)`}
					strokeLinecap="round"
				/>
				<defs>
					<linearGradient
						id={`${id}-gradient-2`}
						x1="913"
						y1="513"
						x2="913"
						y2="913"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#209CE9" />
						<stop offset="1" stopColor="#209CE9" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	)
}

function AppDemo() {
	return (
		<AppScreen>
			<AppScreen.Body>
				<div className="flex h-full w-full flex-col px-4 py-2">
					<div className="flex items-center justify-between gap-2">
						<Logo className="h-auto w-28" />
						<XCircleIcon className="h-6 w-6 text-slate-400" />
					</div>
					<div className="mt-2 flex flex-1 flex-col border-t border-gray-200 pt-4">
						<div className="mb-1 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<QrCodeIcon className="h-5 w-5 text-slate-400" />
								<div className="text-xs font-semibold text-slate-500">
									Scan QR
								</div>
							</div>
							<CircleEllipsisIcon className="h-5 w-5 text-slate-400" />
						</div>
						<div className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-gray-800 sm:py-4">
							<Image
								src={logoXno}
								alt="nano-xno"
								className="h-auto w-8"
								unoptimized
							/>
							<div className="flex gap-1">
								<div className="text-2xl font-semibold">12.345</div>
							</div>
							<div className="text-xs text-gray-500">~ US$10.23</div>
						</div>

						<div className="py-4">
							<div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 py-2 text-xs text-gray-500">
								<div>Send to:</div>
								<div>nano_1payme...jigiof9o</div>
								<CopyIcon className="text-nano h-4 w-4" />
							</div>

							<div className="mb-4 flex items-center justify-center gap-2 border-y border-gray-100 py-4 text-xs text-gray-500">
								<div className="border-nano h-4 w-4 rounded-full border border-b-2 border-t-4"></div>
								Waiting for Payment
							</div>

							<div className="mt-3 divide-y divide-gray-100 text-sm">
								<div className="flex justify-between py-1">
									<div className="text-gray-500">Expires in</div>
									<div className="font-medium text-gray-900">14:45</div>
								</div>
								<div className="flex justify-between py-1">
									<div className="text-gray-500">Invoice</div>
									<div className="font-medium text-gray-900">#4342</div>
								</div>
							</div>
							<div className="bg-nano mt-4 rounded-lg px-4 py-2 text-center text-sm font-semibold text-white">
								Pay me
							</div>
						</div>
					</div>
					<div className="text-3xs mt-4 flex items-center justify-between gap-2 border-t border-gray-100 p-2 text-gray-500 sm:mt-6">
						<Link href="/terms" className="flex-1">
							Terms of Service
						</Link>
						<div className="mx-2 text-gray-100">|</div>
						<Link href="/privacy" className="flex-1">
							Privacy Policy
						</Link>
						<div className="mx-2 text-gray-100">|</div>
						<Link href="mailto:support@nanopay.me" className="flex-1">
							support@nanopay.me
						</Link>
					</div>
				</div>
			</AppScreen.Body>
		</AppScreen>
	)
}

export function Hero() {
	return (
		<div className="overflow-hidden py-8 sm:py-20 lg:py-32 lg:pb-32 xl:pb-36">
			<Container>
				<div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
					<div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-20 xl:col-span-6">
						<h1
							className={clsx(
								'text-3xl font-medium tracking-tight text-gray-900',
								nunito.className,
							)}
						>
							Pay and receive payments with Nano.
						</h1>
						<div className="mt-6 flex flex-col gap-4 text-lg text-gray-600">
							<p>
								NanoPay.me is a payment gateway for Nano (XNO). Open source,
								simple to use and no fees.
							</p>
							<p>
								Serverless and scalable APIs, payment without login,
								notification via webhook and much more! Create a merchant
								account for free and get started now!
							</p>
						</div>
						<div
							className={clsx(
								'mt-8 flex flex-wrap gap-x-6 gap-y-4 font-medium',
								nunito.className,
							)}
						>
							<Link href="/login">
								<Button color="nano" className="text-lg">
									Join the Alfa
								</Button>
							</Link>
							<Link href="/demo">
								<Button variant="outline" color="nano" className="text-lg">
									<PlayIcon className="mr-2 h-6 w-6" />
									Demo
								</Button>
							</Link>
						</div>
					</div>
					<div className="relative mt-10 sm:mt-8 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
						<BackgroundIllustration className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 sm:top-16 sm:-translate-x-1/2 sm:[mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
						<div className="-mx-4 h-[448px] px-9 sm:mx-0 sm:[mask-image:linear-gradient(to_bottom,white_60%,transparent)] lg:absolute lg:-inset-x-10 lg:-bottom-20 lg:-top-10 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
							<PhoneFrame className="mx-auto max-w-[366px]" priority>
								<AppDemo />
							</PhoneFrame>
						</div>
					</div>
					<div className="-mt-4 h-20 lg:mt-0"></div>
				</div>
			</Container>
		</div>
	)
}
