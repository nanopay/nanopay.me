import Image from 'next/image'
import { forwardRef } from 'react'
import { GradientAvatar } from './GradientAvatar'

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

		return (
			<GradientAvatar
				uid={id}
				size={size}
				className={className}
				style={style}
			/>
		)
	},
)
