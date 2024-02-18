'use client'

import { useUser } from '@/contexts/UserProvider'
import Image from 'next/image'
import { Button } from './Button'
import Link from 'next/link'

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
							<p className="text-xs font-medium text-slate-600">
								Welcome back,
							</p>
							<p className="text-xl font-bold text-slate-900 sm:text-2xl">
								{user.name}
							</p>
							<p className="text-sm font-medium text-slate-600">{user.email}</p>
						</div>
					</div>
					<div className="mt-5 flex justify-center sm:mt-0">
						<Button asChild variant="outline">
							<Link href="/profile"> View profile</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
