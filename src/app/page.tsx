'use client'

import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { useAuth } from '@/contexts/AuthProvider'

export default function Index() {
	const { user } = useAuth()

	return (
		<>
			<Header size="lg" user={user} />
			<main>
				<Hero />
				<Faqs />
			</main>
			<Footer />
		</>
	)
}
