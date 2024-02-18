'use client'

import { RefreshCcwIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	const message = error.message

	return (
		<div className="flex h-[100vh] w-full items-center justify-center">
			<div className="rounded-xl bg-white p-6 text-center shadow lg:p-12 xl:p-20">
				<div className="inline-flex rounded-full bg-red-100 p-4">
					<div className="rounded-full bg-red-200 stroke-red-600 p-4">
						<svg
							className="h-16 w-16"
							viewBox="0 0 28 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M17 16L22 21M22 16L17 21"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
					</div>
				</div>
				<h1 className="mt-5 text-2xl font-bold text-slate-700 lg:text-3xl">
					Oops something went wrong.
				</h1>
				{message && (
					<p className="mt-5 border-b border-slate-100 pb-4 font-semibold text-slate-600 lg:text-lg">
						Error Message: <span className="font-medium">{message}</span>
					</p>
				)}
				<div className="mt-5 flex justify-center">
					<button
						onClick={reset}
						className="bg-nano/50 flex gap-2 rounded-lg px-3 py-2 font-semibold uppercase text-slate-800"
					>
						<RefreshCcwIcon className="h-6 w-6" />
						<span>Try again</span>
					</button>
				</div>
				<p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600 lg:text-base">
					Feel free to contact us if the problem presists:
				</p>
				<p className="mt-1 text-sm font-semibold text-slate-600 lg:text-base">
					<Link href="mailto:support@nanopay.me" className="hover:text-nano">
						support@nanopay.me
					</Link>
				</p>
			</div>
		</div>
	)
}
