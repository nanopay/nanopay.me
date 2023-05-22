import clsx from 'clsx'
import { forwardRef } from 'react'

export interface DefaultAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	size?: number
	name: string
}

const DefaultAvatar = forwardRef<HTMLDivElement, DefaultAvatarProps>(
	function DefaultAvatar({ size = 40, name, className, style, ...props }, ref) {
		return (
			<div
				ref={ref}
				className={clsx(
					'text-nano border-nano flex shrink-0 items-center justify-center rounded-full border-2 bg-white p-1',
					className,
				)}
				style={{
					width: size,
					height: size,
					...style,
				}}
				{...props}
			>
				<span
					className="font-bold"
					style={{
						fontSize: size * 0.7,
						lineHeight: size,
					}}
				>
					{name[0].toUpperCase()}
				</span>
			</div>
		)
	},
)

export default DefaultAvatar
