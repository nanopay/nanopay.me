import { BackgroundIllustration } from '@/components/BackgroundIllustration'
import { Logomark } from '@/components/Logo'
import { UserNavigationPopover } from '@/components/UserNavigationPopover'
import { DEFAULT_AVATAR_URL } from '@/core/constants'
import { getCachedUser } from '@/lib/cache/user'
import Image from 'next/image'

export default async function SetupLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getCachedUser()
	return (
		<>
			<header className="fixed top-0 z-20 flex h-14 w-full items-center justify-between bg-slate-200/50 px-4 backdrop-blur supports-[backdrop-filter]:bg-slate-200/60">
				<Logomark className="h-8 w-8" />
				<UserNavigationPopover canViewProfile={!!user}>
					<Image
						width={40}
						height={40}
						className="h-10 w-10 rounded-full border border-slate-200 bg-slate-50 sm:h-9 sm:w-9"
						src={user?.avatar_url || DEFAULT_AVATAR_URL}
						alt="User Avatar"
					/>
				</UserNavigationPopover>
			</header>
			<main className="relative mt-14 flex flex-1 flex-col">
				<div className="absolute -z-10 hidden h-[80%] w-full overflow-hidden pt-20 sm:block">
					<BackgroundIllustration
						width="1090"
						height="1090"
						className="stroke-nano-light relative mx-auto [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9"
					/>
				</div>
				<div className="absolute left-0 top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center px-4">
					{children}
				</div>
			</main>
		</>
	)
}
