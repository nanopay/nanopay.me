import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'
import clsx from 'clsx'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	invalid?: boolean
	startAnimationHelpText?: boolean
	onPressIcon?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ id: _id, label, invalid = false, ...props }, ref) => {
		const reactId = useId()
		const id = _id || reactId
		return (
			<div className="relative h-14">
				<input
					id={id}
					{...props}
					className={cn(
						'focus:border-primary peer h-full w-full rounded-[7px] border border-gray-200 border-t-transparent bg-transparent p-3 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder:opacity-0 placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-t-transparent focus:outline-0 focus:placeholder:opacity-100 disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-50',
						props.className,
						invalid &&
							'!border-2 border-red-500 placeholder-shown:border-red-500 focus:border-red-500 focus:border-t-transparent',
					)}
					placeholder={props.placeholder || ''}
					ref={ref}
				/>
				<label
					htmlFor={id}
					className={clsx(
						"before:content[' '] after:content[' '] peer-focus:text-primary peer-focus:before:!border-primary peer-focus:after:!border-primary pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-gray-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.75] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500",
						invalid &&
							'peer-placeholder-shown:!text-red-500 peer-focus:text-red-500 peer-focus:before:!border-red-500 peer-focus:after:!border-red-500',
					)}
				>
					{label}
				</label>
			</div>
		)
	},
)

Input.displayName = 'Input'

export default Input
