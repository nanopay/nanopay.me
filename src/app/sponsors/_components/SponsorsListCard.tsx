import { GradientAvatar } from '@/components/GradientAvatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Sponsorship } from '@/core/client/sponsors'

export function SponsorshipsListCard({
	sponsors,
}: {
	sponsors: Omit<Sponsorship, 'created_at' | 'invoice'>[]
}) {
	return (
		<Card className="flex w-full flex-1 flex-col overflow-hidden">
			<CardHeader>
				<CardTitle>Our Sponsors</CardTitle>
			</CardHeader>
			<CardContent className="scrollbar-thin w-full divide-y divide-slate-100 overflow-y-auto overflow-x-hidden">
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
						<div className="w-full overflow-hidden">
							<div className="flex w-full justify-between">
								<h3 className="group-hover:text-primary text-[15px] font-semibold leading-5 transition-colors duration-300">
									{sponsor.name}
								</h3>
								<p className="w-16 text-right text-sm font-semibold leading-5 text-slate-600">
									Ӿ{sponsor.amount}
								</p>
							</div>
							<p className="overflow-wrap w-full break-words pr-16 text-[13px] leading-4 text-slate-500">
								{sponsor.message}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
