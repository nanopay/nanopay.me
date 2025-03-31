import * as React from 'react'

import { cn } from '@/lib/cn'

const Table = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableElement>) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn('w-full caption-bottom text-sm', className)}
			{...props}
		/>
	</div>
)
Table.displayName = 'Table'

const TableHeader = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableSectionElement>) => (
	<thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableSectionElement>) => (
	<tbody
		ref={ref}
		className={cn('[&_tr:last-child]:border-0', className)}
		{...props}
	/>
)
TableBody.displayName = 'TableBody'

const TableFooter = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableSectionElement>) => (
	<tfoot
		ref={ref}
		className={cn(
			'border-t bg-slate-100/50 font-medium dark:bg-slate-800/50 [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
)
TableFooter.displayName = 'TableFooter'

const TableRow = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableRowElement>) => (
	<tr
		ref={ref}
		className={cn(
			'border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800',
			className,
		)}
		{...props}
	/>
)
TableRow.displayName = 'TableRow'

const TableHead = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableCellElement>) => (
	<th
		ref={ref}
		className={cn(
			'h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0',
			className,
		)}
		{...props}
	/>
)
TableHead.displayName = 'TableHead'

const TableCell = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableCellElement>) => (
	<td
		ref={ref}
		className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
		{...props}
	/>
)
TableCell.displayName = 'TableCell'

const TableCaption = ({
	ref,
	className,
	...props
}: React.HTMLProps<HTMLTableCaptionElement>) => (
	<caption
		ref={ref}
		className={cn('mt-4 text-sm text-slate-500 dark:text-slate-400', className)}
		{...props}
	/>
)
TableCaption.displayName = 'TableCaption'

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
}
