import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { LandingHeader } from '@/components/LandingHeader'
import { Hero } from '@/components/Hero'
import { isAuthenticated } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Index() {
	const authenticated = await isAuthenticated(cookies())

	return (
		<>
			<LandingHeader size="lg" isAuthenticated={authenticated} />
			<main>
				<Hero />
				<Faqs />
			</main>
			<Footer />
		</>
	)
}
