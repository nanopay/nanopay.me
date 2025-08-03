import Image from 'next/image'
import { GradientAvatar } from './GradientAvatar'

export interface ServiceAvatarProps
	extends Omit<React.ComponentProps<typeof Image>, 'src'> {
	id: string
	alt: string
	size?: number
	src?: string | null
}

export const ServiceAvatar = function ServiceAvatar({
	ref,
	id,
	size = 40,
	src,
	alt,
	className,
	style,
	...props
}: ServiceAvatarProps) {
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
		<GradientAvatar uid={id} size={size} className={className} style={style} />
	)
}
