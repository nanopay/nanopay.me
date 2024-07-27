import { generateGradient } from '@/lib/gradient'
import Image from 'next/image'
import { forwardRef } from 'react'

export interface ServiceAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	id: string
	alt: string
	size?: number
	src?: string | null
}

export const ServiceAvatar = forwardRef<HTMLImageElement, ServiceAvatarProps>(
	function ServiceAvatar(
		{ id, size = 40, src, alt, className, style, ...props },
		ref,
	) {
		if (src) {
			return (
				<Image
					{...props}
					ref={ref}
					className="rounded-full"
					width={size}
					height={size}
					src={src}
					alt={alt}
				/>
			)
		}

		const gradient = generateGradient(id)

		return (
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				className="rounded-full"
			>
				<g>
					<defs>
						<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor={gradient.fromColor} />
							<stop offset="100%" stopColor={gradient.toColor} />
						</linearGradient>
					</defs>
					<rect fill="url(#gradient)" x="0" y="0" width={size} height={size} />
				</g>
			</svg>
		)
	},
)
