import { CloudCogIcon, WebhookIcon, ZapIcon } from 'lucide-react'
import { Container } from './Container'
import DashboardImage from '@/images/features/dashboard.png'
import Image from 'next/image'

const features = [
	{
		name: 'Easy and instantly payments',
		description:
			'Share the payment link and start receiving Nano payments instantly. No registration required to your customers.',
		icon: ZapIcon,
	},
	{
		name: 'Webhooks',
		description:
			'Receive notifications about payments in real-time. Integrate with your services and start automating your business.',
		icon: WebhookIcon,
	},
	{
		name: 'API',
		description:
			'Integrate NanoPay.me with your services and start creating invoices programatically for your customers.',
		icon: CloudCogIcon,
	},
]

export function Features() {
	return (
		<section
			id="features"
			className="border-t border-slate-200 bg-slate-900 py-20 sm:py-16"
		>
			<Container>
				<div>
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl sm:text-center">
							<h2 className="text-nano mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
								Know our features
							</h2>
							<p className="mt-6 text-lg leading-8 text-slate-300">
								NanoPay.me was built with a focus on bringing a better
								experience to businesses and services that want to start
								accepting Nano.
							</p>
						</div>
					</div>
					<div className="relative overflow-hidden pt-8">
						<div className="mx-auto max-w-3xl px-6 lg:px-8">
							<Image
								alt="App Dashboard screenshot"
								src={DashboardImage}
								className="mb-[-6%] rounded-xl shadow-2xl ring-1 ring-slate-100/10"
							/>
							<div aria-hidden="true" className="relative">
								<div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-slate-900 pt-[7%]" />
							</div>
						</div>
					</div>
					<div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-20 md:mt-12 lg:px-8">
						<dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-slate-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
							{features.map(feature => (
								<div key={feature.name} className="relative pl-9">
									<dt className="font-semibold text-slate-100">
										<feature.icon
											aria-hidden="true"
											className="text-nano absolute left-1 top-1 h-5 w-5"
										/>
										{feature.name}
									</dt>
									<dd>{feature.description}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</Container>
		</section>
	)
}
