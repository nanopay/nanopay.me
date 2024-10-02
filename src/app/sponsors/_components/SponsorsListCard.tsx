import { GradientAvatar } from '@/components/GradientAvatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Sponsorship } from '@/core/client/sponsors/sponsors-types'

export function SponsorshipsListCard({
	sponsors,
}: {
	sponsors: Omit<Sponsorship, 'created_at' | 'invoice'>[]
}) {
	return (
		<Card className="!flex !flex-1 !flex-col !overflow-hidden">
			<CardHeader>
				<CardTitle>Our Sponsors</CardTitle>
			</CardHeader>
			<CardContent className="scrollbar-thin divide-y divide-slate-100 overflow-y-auto overscroll-none">
				{sponsors.map(sponsor => (
					<div
						key={sponsor.id}
						className="group flex cursor-pointer items-center space-x-4 py-2"
					>
						{sponsor.avatar_url ? (
							<img
								src={sponsor.avatar_url}
								alt="Avatar"
								className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-125"
							/>
						) : (
							<GradientAvatar
								uid={sponsor.id}
								size={40}
								className="duration-300 group-hover:scale-125"
							/>
						)}
						<div className="w-full">
							<div className="flex justify-between">
								<h3 className="group-hover:text-primary font-semibold transition-colors duration-300">
									{sponsor.name}
								</h3>
								<p className="text-sm font-semibold text-slate-600">
									Ӿ{sponsor.amount}
								</p>
							</div>
							<p className="text-sm text-slate-500">{sponsor.message}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
