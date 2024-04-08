import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { LandingHeader } from '@/components/LandingHeader'
import { Hero } from '@/components/Hero'

export default async function LandingPage() {
	return (
		<>
			<LandingHeader />
			<main>
				<Hero />
				<Faqs />
			</main>
			<Footer />
		</>
	)
}
