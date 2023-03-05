import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

interface ButtonProps extends React.ComponentProps<'button'> {
	variant?: 'solid' | 'outline'
	color?: 'nano' | 'white' | 'slate'
	href: undefined
}

interface ButtonLinkProps extends React.ComponentProps<'a'> {
	variant?: 'solid' | 'outline'
	color?: 'nano' | 'white' | 'slate'
	href?: string
}

const baseStyles = {
	solid:
		'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
	outline:
		'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

const variantStyles = {
	solid: {
		nano: 'relative overflow-hidden bg-nano text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-nano active:text-white/80 before:transition-colors',
		white:
			'bg-white text-nano hover:bg-white/90 active:bg-white/90 active:text-nano/70',
		slate:
			'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-800 active:text-white/80',
	},
	outline: {
		nano: 'border-nano text-nano hover:border-nano active:bg-nano active:text-nano/80',
		slate:
			'border-slate-300 text-slate-700 hover:border-slate-400 active:bg-slate-100 active:text-slate-700/80',
		white:
			'border-white text-white hover:border-white/80 active:bg-white/80 active:text-white/80',
	},
}

export const Button = forwardRef(function Button(
	{
		variant = 'solid',
		color = 'slate',
		className,
		href,
		...props
	}: ButtonProps | ButtonLinkProps,
	ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
	className = clsx(
		baseStyles[variant],
		variantStyles[variant][color],
		className,
	)

	return href ? (
		<Link
			ref={ref as any}
			href={href}
			className={clsx('font-nunito', className)}
			{...(props as ButtonLinkProps)}
		/>
	) : (
		<button
			ref={ref as any}
			className={clsx('font-nunito', className)}
			{...(props as ButtonProps)}
		/>
	)
})
