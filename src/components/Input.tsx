import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { Roboto } from '@next/font/google'

type InputProps = TextFieldProps & {
	label: string
	errorMessage?: string
	isRequired?: boolean
	containerClassName?: string
}

const roboto = Roboto({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
})

export default function Input({
	label,
	errorMessage,
	isRequired,
	containerClassName,
	...props
}: InputProps) {
	return (
		<div className={containerClassName || 'mb-4 w-full'}>
			<TextField
				label={label}
				variant="standard"
				error={!!errorMessage}
				required={isRequired}
				size="medium"
				{...(props as any)}
				color="primary"
				style={{
					backgroundColor: '#fff',
					borderColor: '#fff',
				}}
			/>
			{errorMessage && (
				<span
					className={`mt-1 ml-1 flex items-center text-xs tracking-wide text-red-500 ${roboto.className}`}
				>
					{errorMessage}
				</span>
			)}
		</div>
	)
}
