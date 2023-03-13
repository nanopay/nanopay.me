import Head from 'next/head'
import { GetServerSidePropsContext } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { UserProfile } from '@/types/users'

export default function Home({ user }: { user: UserProfile }) {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const supabase = createServerSupabaseClient(ctx)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	return {
		props: {
			user: session?.user?.user_metadata?.internal_profile || null,
		},
	}
}
