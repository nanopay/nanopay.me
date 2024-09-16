'use client'

import { useUser } from '@/contexts/UserProvider'

import { UserAvatarCard } from './_components/UserAvatarCard'
import { UserNameCard } from './_components/UserNameCard'
import { UserEmailCard } from './_components/UserEmailCard'
import { UserDeleteCard } from './_components/UserDeleteCard'

export default function AccountSettingsPage() {
	const user = useUser()

	return (
		<div className="w-full">
			<div className="flex flex-col space-y-8">
				<UserAvatarCard value={user.avatar_url} />

				<UserNameCard value={user.name} />

				<UserEmailCard value={user.email} />

				<UserDeleteCard />
			</div>
		</div>
	)
}
