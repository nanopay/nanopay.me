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

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<main className="flex flex-col flex-1 min-h-full overflow-hidden sm:pt-16 sm:py-28">
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
