import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

const baseStyles = {
	solid:
		'inline-flex justify-center rounded-lg py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors',
	outline:
		'inline-flex justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors',
}

const variantStyles = {
	solid: {
		cyan: 'relative overflow-hidden bg-blue-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-blue-600 active:text-white/80 before:transition-colors',
		white:
			'bg-white text-blue-900 hover:bg-white/90 active:bg-white/90 active:text-blue-900/70',
		slate:
			'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-800 active:text-white/80',
	},
	outline: {
		slate:
			'border-slate-300 text-slate-700 hover:border-slate-400 active:bg-slate-100 active:text-slate-700/80',
	},
}

export const Button = forwardRef(function Button(
	{ variant = 'solid', color = 'slate', className, href, ...props },
	ref,
) {
	className = clsx(
		baseStyles[variant],
		variantStyles[variant][color],
		className,
	)

	return href ? (
		<Link
			ref={ref}
			href={href}
			className={clsx('font-nunito', className)}
			{...props}
		/>
	) : (
		<button ref={ref} className={clsx('font-nunito', className)} {...props} />
	)
})
