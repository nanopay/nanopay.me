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
		return (
			<Image
				{...props}
				ref={ref}
				className="rounded-full"
				width={size}
				height={size}
				src={src || `https://avatar.vercel.sh/${id}`}
				alt={alt}
			/>
		)
	},
)
