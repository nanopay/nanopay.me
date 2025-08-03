export const viewport: Viewport = {
	initialScale: 1,
	maximumScale: 1,
}

import { Button } from '@/components/Button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card'
import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer'
import { SponsorCard } from './_components/SponsorCard'
import { SponsorshipsListCard } from './_components/SponsorsListCard'
import { AdminClient } from '@/core/client'
import { unstable_noStore } from 'next/cache'
import initialSponsors from './initial-sponsors.json'
import { Viewport } from 'next'

export default async function SponsorPage() {
	unstable_noStore()

	const client = new AdminClient()
	const sponsors = [
		...(await client.sponsors.list()),
		...initialSponsors.reverse(),
	]
	const accumulated = sponsors.reduce((acc, sponsor) => acc + sponsor.amount, 0)
	const goal = 2000
	const accumulatedPercentage = (accumulated / goal) * 100

	return (
		<>
			<div className="flex h-full w-full max-w-7xl pb-10 md:gap-4 lg:gap-8">
				<div className="flex w-full flex-1 flex-col md:w-1/2">
					<Card className="mb-4">
						<CardHeader className="pb-4">
							<CardTitle>Beta Release</CardTitle>
							<CardDescription>
								Help us build the future of payments
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<div className="w-full">
								<p className="py-1 text-sm text-slate-600">
									{parseFloat(accumulatedPercentage.toString()).toFixed(1)}%{' '}
									towards our goal of{' '}
									<span className="font-semibold">Ӿ{goal}</span>
								</p>
								<div className="w-full rounded-full bg-slate-200">
									<div
										className="h-2 rounded-full  bg-linear-to-r from-pink-400/60 to-[#4A90E2]"
										style={{
											width: `${accumulatedPercentage}%`,
										}}
									></div>
								</div>
							</div>
						</CardFooter>
					</Card>
					<SponsorshipsListCard sponsors={sponsors} />
				</div>
				<div className="hidden justify-end md:flex md:w-1/2">
					<SponsorCard />
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 px-4 py-2 md:hidden">
				<Drawer>
					<DrawerTrigger asChild>
						<Button
							className="w-full bg-linear-to-br from-[#4A90E2] to-pink-400/60 text-lg font-bold hover:bg-[#357ABD]"
							size="lg"
						>
							Ӿ Sponsor
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<SponsorCard className="border-none" />
					</DrawerContent>
				</Drawer>
			</div>
		</>
	)
}
