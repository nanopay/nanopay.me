import { cn } from '@/lib/cn'
import { generateGradient } from '@/lib/gradient'

export interface GradientAvatarProps extends React.ComponentProps<'svg'> {
	uid: string
	size: number
}

export function GradientAvatar({
	uid,
	size,
	className,
	...props
}: GradientAvatarProps) {
	const gradient = generateGradient(uid)

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			className={cn('flex-shrink-0 rounded-full', className)}
			{...props}
		>
			<g>
				<defs>
					<linearGradient id={`gradient-${uid}`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={gradient.fromColor} />
						<stop offset="100%" stopColor={gradient.toColor} />
					</linearGradient>
				</defs>
				<rect
					fill={`url(#gradient-${uid})`}
					x="0"
					y="0"
					width={size}
					height={size}
				/>
			</g>
		</svg>
	)
}
