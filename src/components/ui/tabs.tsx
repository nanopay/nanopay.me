'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/cn'

const Tabs = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => (
	<TabsPrimitive.Root
		ref={ref}
		className={cn('scrollbar-none overflow-x-auto', className)}
		{...props}
	/>
)

Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center overflow-hidden text-slate-500 dark:bg-slate-800 dark:text-slate-400',
			className,
		)}
		{...props}
	/>
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'data-[state=active]:border-nano/70 data-[state=active]:text-nano inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50',
			className,
		)}
		{...props}
	/>
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
			className,
		)}
		{...props}
	/>
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
