import Head from 'next/head'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { useAuth } from '@/contexts/AuthProvider'

export default function Home() {
	const { user } = useAuth()

	return (
		<>
			<Head>
				<title>NanoPay.me - Pay and receive payments with Nano.</title>
				<meta
					name="description"
					content="A payment gateway for Nano (XNO). Open source, simple to use and no fees."
				/>
			</Head>
			<Header size="lg" user={user} />
			<main>
				<Hero />
				<Faqs />
			</main>
			<Footer />
		</>
	)
}
