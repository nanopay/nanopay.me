import Link from 'next/link'

export interface NavPaginationProps {
	count: number
	from: number
	to: number
	limit: number
}

export function NavPagination({ count, from, to, limit }: NavPaginationProps) {
	if (count <= limit) return null

	const previousPage = from > 1 ? Math.floor((from - 1) / limit) + 1 : null
	const nextPage = to < count ? Math.floor(to / limit) + 1 : null

	return (
		<nav
			className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6"
			aria-label="Pagination"
		>
			<div className="hidden sm:block">
				{count > 0 ? (
					<p className="text-sm text-slate-700">
						Showing <span className="font-medium">{from}</span> to{' '}
						<span className="font-medium">{to}</span> of{' '}
						<span className="font-medium">{count}</span> results
					</p>
				) : (
					<p className="text-sm text-slate-700">
						<span className="font-medium">No results</span>
					</p>
				)}
			</div>
			<div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
				{previousPage && (
					<Link
						href={`?page=${previousPage}`}
						className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
					>
						Previous
					</Link>
				)}
				{nextPage && (
					<Link
						href={`?page=${nextPage}`}
						className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:ring-slate-400"
					>
						Next
					</Link>
				)}
			</div>
		</nav>
	)
}

export function NavPaginationMobile({
	count,
	from,
	to,
	limit,
}: NavPaginationProps) {
	if (count <= limit) return null

	const previousPage = from > 1 ? Math.floor((from - 1) / limit) + 1 : null
	const nextPage = to < count ? Math.floor(to / limit) + 1 : null

	return (
		<nav
			className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3"
			aria-label="Pagination"
		>
			<div className="flex flex-1 justify-between">
				{previousPage ? (
					<a
						href="#"
						className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
					>
						Previous
					</a>
				) : (
					<div />
				)}
				{nextPage ? (
					<a
						href="#"
						className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
					>
						Next
					</a>
				) : (
					<div />
				)}
			</div>
		</nav>
	)
}
