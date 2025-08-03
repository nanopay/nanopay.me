'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '@/lib/cn'

const InputOTP = ({
	ref,
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput>) => (
	<OTPInput
		ref={ref}
		containerClassName={cn(
			'flex items-center gap-2 has-disabled:opacity-50',
			containerClassName,
		)}
		className={cn('disabled:cursor-not-allowed', className)}
		{...props}
	/>
)
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = ({
	ref,
	className,
	...props
}: React.ComponentProps<'div'>) => (
	<div ref={ref} className={cn('flex items-center', className)} {...props} />
)
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = ({
	ref,
	index,
	className,
	...props
}: React.ComponentProps<'div'> & { index: number }) => {
	const inputOTPContext = React.use(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

	return (
		<div
			ref={ref}
			className={cn(
				'relative flex h-16 w-12 items-center justify-center border-y border-r border-slate-200 text-lg transition-all first:rounded-l-md first:border-l last:rounded-r-md dark:border-slate-800',
				isActive &&
					'ring-nano dark:ring-offset-nano z-10 ring-2 ring-offset-white dark:ring-slate-300',
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="animate-caret-blink h-4 w-px bg-slate-950 duration-1000 dark:bg-slate-50" />
				</div>
			)}
		</div>
	)
}
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = ({ ref, ...props }: React.ComponentProps<'div'>) => (
	<div ref={ref} role="separator" {...props}>
		<Dot />
	</div>
)
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
