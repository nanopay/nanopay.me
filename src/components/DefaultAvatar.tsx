import clsx from 'clsx'
import { forwardRef } from 'react'

export interface DefaultAvatarProps
	extends React.HTMLAttributes<HTMLDivElement> {
	size?: number
	name: string
}

const DefaultAvatar = forwardRef<HTMLDivElement, DefaultAvatarProps>(
	({ size = 28, name, className, style, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={clsx(
					'text-nano border-nano flex shrink-0 items-center justify-center rounded-full border-2 bg-white aspect-square p-1',
					className,
				)}
				{...props}
			>
				<span
					className="font-bold leading-8"
					style={{
						fontSize: size,
					}}
				>
					{name
						.split(' ')
						.slice(0, 2)
						.map(word => word[0])
						.join('')}
				</span>
			</div>
		)
	},
)

export default DefaultAvatar
