import clsx from 'clsx'
import Image from 'next/image'
import { forwardRef } from 'react'

export interface DefaultAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	name: string
	size?: number
	src?: string
}

const DefaultAvatar = forwardRef<HTMLDivElement, DefaultAvatarProps>(
	function DefaultAvatar(
		{ name, size = 40, src, className, style, ...props },
		ref,
	) {
		return (
			<div
				ref={ref}
				className={clsx(
					'text-nano border-slate-200 flex shrink-0 items-center justify-center rounded-full border-2 bg-white p-1',
					className,
				)}
				style={{
					width: size,
					height: size,
					...style,
				}}
				{...props}
			>
				{src ? (
					<Image
						className="rounded-full"
						width={size}
						height={size}
						src={src}
						alt={name}
					/>
				) : (
					<span
						className="font-bold"
						style={{
							fontSize: size * 0.7,
							lineHeight: size,
						}}
					>
						{name[0].toUpperCase()}
					</span>
				)}
			</div>
		)
	},
)

export default DefaultAvatar
