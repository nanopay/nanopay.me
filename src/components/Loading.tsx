import clsx from 'clsx'

export default function Loading({ ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			{...props}
			className={clsx('reverse-spinner w-20 h-20', props.className)}
		/>
	)
}
