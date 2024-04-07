import clsx from 'clsx'
import Image from 'next/image'
import { forwardRef } from 'react'

export interface DefaultAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	id: string
	alt: string
	size?: number
	src?: string | null
}

export const DefaultAvatar = forwardRef<HTMLImageElement, DefaultAvatarProps>(
	function DefaultAvatar(
		{ id, size = 40, src, alt, className, style, ...props },
		ref,
	) {
		return (
			<Image
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
