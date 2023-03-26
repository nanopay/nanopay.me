import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect } from 'react'
import { Container } from '@/components/Container'
import { useRouter } from 'next/router'
import { getURL } from '@/utils/helpers'
import { AuthLayout } from '@/components/AuthLayout'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
	const supabaseClient = useSupabaseClient()
	const user = useUser()
	const router = useRouter()

	const redirectTo = `${getURL()}/auth/${
		router.query.redirectedFrom || '/home'
	}`

	useEffect(() => {
		if (user) router.push(redirectTo)
	}, [user])

	return (
		<AuthLayout title="">
			<Container className="w-full sm:max-w-lg h-screen sm:h-auto flex flex-col justify-center p-16 rounded-xl sm:border border-nano/20 sm:shadow-md shadow-nano/10 bg-zinc-900">
				<div className="mb-16">
					<Link href="/" aria-label="Home">
						<Logo theme="dark" className="mx-auto h-10 w-auto" />
					</Link>
				</div>
				<Auth
					redirectTo={redirectTo}
					magicLink={true}
					appearance={{
						theme: ThemeSupa,
						variables: {
							default: {
								colors: {
									brand: '#209CE9',
									brandAccent: '#209CE9',
								},
							},
						},
					}}
					supabaseClient={supabaseClient}
					providers={['github']}
					socialLayout="vertical"
					theme="dark"
				/>
			</Container>
		</AuthLayout>
	)
}
