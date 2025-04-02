import { cn } from '@/lib/cn'
import React, { useId } from 'react'

export interface TextAreaProps extends React.ComponentProps<'textarea'> {
	label?: string
	invalid?: boolean
	startAnimationHelpText?: boolean
	containerClassName?: string
}

export const TextArea = ({
	ref,
	id: _id,
	label,
	invalid = false,
	containerClassName,
	...props
}: TextAreaProps) => {
	const reactId = useId()
	const id = _id || reactId
	return (
		<div className={cn('relative h-24 bg-white', containerClassName)}>
			<textarea
				id={id}
				{...props}
				className={cn(
					// Base styles
					'scrollbar-none peer h-full w-full resize-none rounded-md border border-slate-200 border-t-transparent bg-transparent p-3 font-sans text-sm font-normal text-slate-700 outline outline-0 transition-all',

					// Placeholder styles
					'placeholder:opacity-0 placeholder-shown:border placeholder-shown:border-slate-200 placeholder-shown:border-t-slate-200',

					// Focus styles
					'focus:border-primary focus:border-2 focus:border-t-transparent focus:outline-0 focus:placeholder:opacity-100',

					// Disabled styles
					'disabled:bg-muted! disabled:cursor-not-allowed! disabled:border-0!',

					// Invalid styles
					invalid &&
						'border-2! border-red-500! border-t-transparent! placeholder-shown:border-t-red-500! focus:border-red-500 focus:border-t-transparent!',

					// Additional classes
					props.className,
				)}
				placeholder={props.placeholder || ''}
				ref={ref}
			/>
			<label
				htmlFor={id}
				className={cn(
					// Base styles
					'absolute -top-1.5 left-0 flex h-3 w-full select-none overflow-visible! truncate bg-inherit text-xs font-normal leading-tight text-slate-500 transition-all',

					// Before styles
					'before:content[" "] before:pointer-events-none before:mr-1 before:mt-1.5 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-slate-200 before:transition-all',

					// After styles
					'after:content[" "] after:pointer-events-none after:ml-1 after:mt-1.5 after:box-border after:block after:h-1.5 after:w-2.5 after:grow after:rounded-tr-md after:border-r after:border-t after:border-slate-200 after:transition-all',

					// Peer-placeholder-shown styles
					'peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.75] peer-placeholder-shown:text-slate-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent',

					// Peer-focus styles
					'peer-focus:text-primary peer-focus:before:border-primary peer-focus:after:border-primary peer-focus:text-xs peer-focus:leading-tight peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-t-2',

					// Peer-disabled styles
					'peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent',

					// Invalid styles
					invalid &&
						'text-red-500! before:border-t-2! before:border-l-2 before:border-red-500 after:border-r-2 after:border-t-2 after:border-red-500! peer-placeholder-shown:before:border-transparent! peer-placeholder-shown:after:border-transparent! peer-focus:before:border-red-500! peer-focus:after:border-red-500!',
				)}
			>
				<span>{label}</span>
			</label>
		</div>
	)
}

TextArea.displayName = 'TextArea'
