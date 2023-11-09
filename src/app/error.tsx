'use client'

import { ArrowPathIcon } from '@heroicons/react/24/solid'
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
		<div className="flex h-[100vh] items-center justify-center w-full">
			<div className="bg-white p-6 lg:p-12 xl:p-20 rounded-xl shadow text-center">
				<div className="inline-flex rounded-full bg-red-100 p-4">
					<div className="rounded-full stroke-red-600 bg-red-200 p-4">
						<svg
							className="w-16 h-16"
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
				<h1 className="mt-5 text-2xl lg:text-3xl font-bold text-slate-700">
					Oops something went wrong.
				</h1>
				{message && (
					<p className="text-slate-600 mt-5 lg:text-lg font-semibold border-b border-gray-100 pb-4">
						Error Message: <span className="font-medium">{message}</span>
					</p>
				)}
				<div className="mt-5 flex justify-center">
					<button
						onClick={reset}
						className="flex gap-2 text-slate-800 bg-nano/50 px-3 py-2 rounded-lg font-semibold uppercase"
					>
						<ArrowPathIcon className="w-6 h-6" />
						<span>Try again</span>
					</button>
				</div>
				<p className="text-slate-600 mt-5 text-sm lg:text-base border-t border-gray-100 pt-4">
					Feel free to contact us if the problem presists:
				</p>
				<p className="text-slate-600 mt-1 text-sm lg:text-base font-semibold">
					<Link href="mailto:support@nanopay.me" className="hover:text-nano">
						support@nanopay.me
					</Link>
				</p>
			</div>
		</div>
	)
}
