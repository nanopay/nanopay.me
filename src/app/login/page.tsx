'use client'

import { Container } from '@/components/Container'
import { useSearchParams } from 'next/navigation'
import { getURL } from '@/utils/helpers'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Image from 'next/image'
import GithubSVG from '@/images/logos/github.svg'
import { Button } from '@/components/Button'
import Input from '@/components/Input'

export default function LoginPage() {
	const supabase = createBrowserSupabaseClient<Database>()

	const redirectedFrom = useSearchParams()?.get('redirectedFrom')

	const redirectTo = `${getURL()}redirect?to=${encodeURI(
		typeof redirectedFrom === 'string' ? redirectedFrom : '/home',
	)}`

	const sign = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo,
			},
		})
	}

	return (
		<Container className="w-full sm:max-w-lg h-screen sm:h-auto flex flex-col justify-center p-16 rounded-xl sm:shadow-md shadow-nano/10 bg-white">
			<div className="mb-6">
				<Link href="/" aria-label="Home">
					<Logo theme="light" className="mx-auto h-12 w-auto" />
				</Link>
			</div>
			<div className="w-full flex flex-col space-y-6 px-2 sm:px-4 divide-y divide-slate-200">
				<Button color="slate" onClick={sign} variant="outline">
					<div className="flex items-center space-x-2">
						<Image src={GithubSVG} width={20} height={20} alt="github icon" />
						<span>Sign in with Github</span>
					</div>
				</Button>
				<div className="py-6 w-full">
					<Input
						label="Email"
						className="w-full rounded !bg-transparent !text-white"
					/>
					<Input
						label="Password"
						className="w-full rounded !bg-transparent !text-white"
					/>
					<Button color="nano" onClick={sign} className="w-full">
						Sign In
					</Button>
					<div className="pt-6 flex flex-col items-center">
						<Link href="" className="text-sm text-nano hover:underline">
							Send a magic link email
						</Link>
						<Link href="" className="text-sm text-nano hover:underline">
							Forgot your password ?
						</Link>
					</div>
				</div>
				<div className="py-6 flex flex-col items-center">
					<h2 className="text-base font-semibold text-slate-600">
						Don't have an account ?{' '}
						<Link href="" className="text-nano underline">
							Sign up
						</Link>
					</h2>
				</div>
			</div>
		</Container>
	)
}
