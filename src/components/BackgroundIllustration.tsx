import { useId } from 'react'

export function BackgroundIllustration(props: React.ComponentProps<'svg'>) {
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

export function AnimatedBackgroundIllustration(
	props: React.ComponentProps<'div'>,
) {
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
					stroke="#cbd5e1"
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
					stroke="#cbd5e1"
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
