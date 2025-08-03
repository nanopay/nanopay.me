import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

const alertVariants = cva(
	'relative w-full rounded-lg border border-slate-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 dark:border-slate-800 dark:[&>svg]:text-slate-50',
	{
		variants: {
			variant: {
				default: 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-50',
				destructive:
					'border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const Alert = ({
	ref,
	className,
	variant,
	...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
)
Alert.displayName = 'Alert'

const AlertTitle = ({
	ref,
	className,
	...props
}: React.ComponentProps<'h5'>) => (
	<h5
		ref={ref}
		className={cn('mb-1 font-medium leading-none tracking-tight', className)}
		{...props}
	/>
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = ({
	ref,
	className,
	...props
}: React.ComponentProps<'p'>) => (
	<div
		ref={ref}
		className={cn('text-sm [&_p]:leading-relaxed', className)}
		{...props}
	/>
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
