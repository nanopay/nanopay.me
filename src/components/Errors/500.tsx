import Link from 'next/link'

export default function Error500({ message }: { message?: string }) {
	return (
		<div className="flex h-[calc(100vh-80px)] items-center justify-center p-5 w-full bg-white">
			<div className="text-center">
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
				<h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">
					500 - Server error
				</h1>
				<p className="text-slate-600 mt-5 lg:text-lg">
					Oops something went wrong. Try to refresh this page or <br /> feel
					free to contact us if the problem presists.
				</p>
				<p className="text-slate-600 mt-5 lg:text-lg font-semibold">
					<Link href="mailto:support@nanopay.me" className="hover:text-nano">
						support@nanopay.me
					</Link>
				</p>
				{message && (
					<p className="text-slate-600 mt-5 lg:text-lg font-semibold border-t border-gray-100 pt-4">
						Error Message: <span className="font-medium">{message}</span>
					</p>
				)}
			</div>
		</div>
	)
}
