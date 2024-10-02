import { Container } from '@/components/Container'
import Image from 'next/image'
import xnoHeart from '@/images/xno-heart.svg'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { AdminClient } from '@/core/client'
import { unstable_noStore } from 'next/cache'
import initialSponsors from '../app/sponsors/initial-sponsors.json'
import Link from 'next/link'

export async function Sponsors() {
	unstable_noStore()
	const client = new AdminClient()
	const newSponsors = await client.sponsors.list()
	const sponsors = [...newSponsors, ...initialSponsors].filter(
		sponsor => sponsor.avatar_url,
	)

	return (
		<section
			id="sponsors"
			aria-labelledby="faqs-title"
			className="py-16 md:py-20"
			style={{
				backgroundColor: 'rgb(46, 67, 120)',
				backgroundImage:
					'url(https://nano.org/images/common/background-gradients/gradient-1.svg)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}
		>
			<Container className="flex flex-col items-center justify-between gap-8 md:flex-row-reverse lg:gap-16">
				<Card className="w-full max-w-full overflow-hidden rounded-3xl border-none bg-white/10 p-4 text-white md:w-[620px] md:p-8">
					<CardHeader>
						<CardTitle className="text-4xl">Our Sponsors</CardTitle>
						<CardDescription className="text-lg text-slate-200">
							NanoPay is a voluntary initiative. Became a sponsor and help us
							maintain the project by making donations with Nano.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{[...Array(Math.ceil(sponsors.length / 6))].map((_, rowIndex) => (
							<div
								key={rowIndex}
								className="mx-auto mt-2 flex w-fit -space-x-3 last:mb-0 "
							>
								{sponsors
									.slice(rowIndex * 6, (rowIndex + 1) * 6)
									.map(sponsor => (
										<Image
											src={sponsor.avatar_url as string}
											alt={sponsor.name}
											width={80}
											height={80}
											className="ring-nano h-14 w-14 rounded-full bg-white ring-2 md:h-16 md:w-16"
											key={sponsor.id}
											quality={100}
										/>
									))}
							</div>
						))}

						<div className="mt-12 flex w-full justify-center">
							<Link href="/sponsors">
								<button className="border-nano hover:bg-nano bg-nano/20 flex items-center space-x-4 rounded-xl border px-6 py-3">
									<Image src={xnoHeart} alt="XNO" className="h-12 w-12" />
									<h3 className="text-2xl font-semibold">Sponsor</h3>
								</button>
							</Link>
						</div>
					</CardContent>
				</Card>
				<Card className="w-full max-w-full rounded-3xl border-none bg-white/10 p-8 text-white md:w-[460px]">
					<q className="py-8 text-2xl md:text-3xl">
						Nano deserves a payment gateway as good as it&apos;s own technology.
					</q>
					<div className="mt-6 flex flex-col items-center space-x-6 lg:flex-row">
						<img
							src="https://github.com/anarkrypto.png"
							alt="Anarkrypto"
							width={80}
							height={80}
							className="ring-nano h-32 w-32 rounded-full bg-white ring-2 md:h-20 md:w-20"
						/>
						<div className="text-center">
							<h3 className="mt-4 text-2xl font-semibold">Kaique Nunes</h3>
							<p className="text-base text-slate-200 md:text-lg">
								Creator of NanoPay.me
							</p>
						</div>
					</div>
				</Card>
			</Container>
		</section>
	)
}
