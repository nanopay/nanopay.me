import Image from 'next/image'
import { generateGradientSvgDataUrl } from '@/lib/gradient'

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
	return (
		<Image
			{...props}
			ref={ref}
			className="rounded-full"
			width={size}
			height={size}
			src={src || generateGradientSvgDataUrl(id, size)}
			alt={alt}
		/>
	)
}
