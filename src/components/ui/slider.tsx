'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/cn'

const Slider = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex w-full touch-none select-none items-center',
			className,
		)}
		{...props}
	>
		<SliderPrimitive.Track className="dark:bg-nano relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
			<SliderPrimitive.Range className="bg-nano-dark absolute h-full dark:bg-slate-50" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="border-nano-dark block h-5 w-5 rounded-full border-2 bg-white ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300" />
	</SliderPrimitive.Root>
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
