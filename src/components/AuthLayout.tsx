import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { ReactNode } from 'react'

function BackgroundIllustration(props: React.ComponentProps<'svg'>) {
	return (
		<svg
			viewBox="0 0 1090 1090"
			aria-hidden="true"
			fill="none"
			preserveAspectRatio="none"
			{...props}
		>
			<circle cx={545} cy={545} r="544.5" />
			<circle cx={545} cy={545} r="480.5" />
			<circle cx={545} cy={545} r="416.5" />
			<circle cx={545} cy={545} r="352.5" />
		</svg>
	)
}

interface AuthLayoutProps {
	title: string
	subtitle?: string | ReactNode
	children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className="flex min-h-full overflow-hidden sm:pt-16 sm:py-28 bg-zinc-900">
			<div className="mx-auto flex w-full max-w-2xl flex-col sm:px-6">
				<div className="relative mt-16 hidden sm:block">
					<BackgroundIllustration
						width="1090"
						height="1090"
						className="absolute -top-7 left-1/2 h-[788px] -translate-x-1/2 stroke-nano/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto"
					/>
				</div>
				<div className="sm:mt-10 z-10">{children}</div>
			</div>
		</main>
	)
}
