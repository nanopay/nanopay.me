import { forwardRef } from 'react'
import { Loader2Icon } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const variantStyles = {
	default: {
		nano: 'bg-nano hover:bg-nano-dark dark:text-nano text-white dark:bg-nano-light dark:hover:bg-none',
		slate:
			'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100',
	},
	outline: {
		nano: 'border border-nano/50 bg-none text-nano hover:border-nano-dark/70 hover:text-nano-dark dark:border-nano dark:bg-slate-950 dark:hover:bg-nano dark:hover:text-nano hover:bg-none',
		slate:
			'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
	},
	link: {
		nano: 'text-nano underline-offset-4 hover:underline dark:text-nano',
		slate:
			'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
	},
	ghost: {
		nano: 'hover:bg-nano hover:text-nano dark:hover:bg-nano dark:hover:text-nano',
		slate:
			'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
	},
}

const strictVariantStyles = {
	destructive:
		'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
}

const sizes = {
	default: 'h-10 px-4 py-2',
	sm: 'h-9 rounded-md px-3',
	lg: 'h-11 rounded-md px-8',
	icon: 'h-10 w-10',
}

export interface BaseButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: keyof typeof sizes
	loading?: boolean
	asChild?: boolean
}
export interface ButtonProps extends BaseButtonProps {
	color?: 'nano' | 'slate'
	variant?: keyof typeof variantStyles
}

export interface StrictButtonProps extends BaseButtonProps {
	variant?: keyof typeof strictVariantStyles
}

const Button = forwardRef<HTMLButtonElement, ButtonProps | StrictButtonProps>(
	(
		{
			variant = 'default',
			color = 'slate',
			size = 'default',
			disabled,
			loading,
			children,
			asChild,
			className,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button'

		const variantStyle =
			variant in variantStyles &&
			variantStyles[variant as keyof typeof variantStyles]

		const strictVariantStyle =
			strictVariantStyles[variant as keyof typeof strictVariantStyles]

		return (
			<Comp
				{...props}
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors',
					'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2',
					'active:scale-95',
					'disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
					sizes[size],
					variantStyle
						? variantStyle[color as keyof typeof variantStyle]
						: strictVariantStyle,
					className,
				)}
				disabled={loading || disabled}
				ref={ref}
			>
				{loading ? (
					<Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
				) : (
					children
				)}
			</Comp>
		)
	},
)

Button.displayName = 'Button'

export { Button }
