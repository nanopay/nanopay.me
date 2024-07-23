import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { LandingHeader } from '@/components/LandingHeader'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'

export default async function LandingPage() {
	return (
		<>
			<LandingHeader />
			<main>
				<Hero />
				<Features />
				<Faqs />
			</main>
			<Footer />
		</>
	)
}
