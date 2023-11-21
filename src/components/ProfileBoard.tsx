'use client'

import { useUser } from '@/contexts/UserProvider'
import Image from 'next/image'

export default function ProfileBoard() {
	const user = useUser()

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow">
			<h2 className="sr-only" id="profile-overview-title">
				Profile Overview
			</h2>
			<div className="bg-white p-6">
				<div className="sm:flex sm:items-center sm:justify-between">
					<div className="sm:flex sm:space-x-5">
						<div className="flex-shrink-0">
							<Image
								className="mx-auto h-20 w-20 rounded-full"
								src={user.avatar_url}
								alt=""
								width={80}
								height={80}
								priority
							/>
						</div>
						<div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
							<p className="text-xs font-medium text-gray-600">Welcome back,</p>
							<p className="text-xl font-bold text-gray-900 sm:text-2xl">
								{user.name}
							</p>
							<p className="text-sm font-medium text-gray-600">{user.email}</p>
						</div>
					</div>
					<div className="mt-5 flex justify-center sm:mt-0">
						<a
							href="#"
							className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-50"
						>
							View profile
						</a>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-slate-200 bg-slate-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
				<div className="px-6 py-5 text-center text-sm font-medium">
					<span className="text-gray-900">0</span>{' '}
					<span className="text-gray-600">...</span>
				</div>

				<div className="px-6 py-5 text-center text-sm font-medium">
					<span className="text-gray-900">0</span>{' '}
					<span className="text-gray-600">...</span>
				</div>

				<div className="px-6 py-5 text-center text-sm font-medium">
					<span className="text-gray-900">0</span>{' '}
					<span className="text-gray-600">...</span>
				</div>
			</div>
		</div>
	)
}
