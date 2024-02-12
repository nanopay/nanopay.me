import { forwardRef } from 'react'
import {
	Button as ShadButton,
	ButtonProps as ShadButtonProps,
} from '@/components/ui/button'
import clsx from 'clsx'
import { Loader2Icon } from 'lucide-react'

export interface ButtonProps extends ShadButtonProps {
	color?: 'nano' | 'slate'
	loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ color = 'slate', disabled, loading, children, ...props }: ButtonProps,
		ref,
	) => {
		return (
			<ShadButton
				{...props}
				className={clsx(
					props.className,
					color === 'nano' &&
						'bg-nano hover:bg-nano-dark dark:text-nano text-white dark:bg-[#d2ebfa]',
				)}
				disabled={loading || disabled}
				ref={ref}
			>
				{loading ? (
					<Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
				) : (
					children
				)}
			</ShadButton>
		)
	},
)
