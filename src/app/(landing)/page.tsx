import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { LandingHeader } from '@/components/LandingHeader'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Sponsors } from '@/components/Sponsors'

export default async function LandingPage() {
	return (
		<>
			<LandingHeader />
			<main>
				<Hero />
				<Features />
				<Sponsors />
				<Faqs />
			</main>
			<Footer theme="dark" />
		</>
	)
}
