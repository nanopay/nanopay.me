import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getProviders, useSession, signIn } from 'next-auth/react'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import Image from 'next/image'

export default function Login() {
	const { push, query } = useRouter()

	const [providers, setProviders] = useState<any>(null)

	const { status } = useSession()

	if (status === 'authenticated') {
		push(
			typeof query.callbackUrl === 'string' ? query.callbackUrl : '/dashboard',
		)
	}

	const configureProviders = async (status: string) => {
		if (status !== 'loading') {
			if ((await providers) === null) {
				setProviders(await getProviders())
			}
		}
	}

	useEffect(() => {
		configureProviders(status)
	}, [status])

	return (
		<>
			<Head>
				<title>Sign In - NanoPay.me</title>
			</Head>
			<AuthLayout
				title="Sign in to account"
				subtitle={<>Authenticate directly with one of the providers:</>}
			>
				<ul className="w-full flex flex-col items-center">
					{providers &&
						Object.keys(providers).map((providerKey, i) => (
							<li key={i}>
								{providers[providerKey].type !== 'credentials' && (
									<Button
										variant="outline"
										type="submit"
										className="w-100 mb-3 space-x-2"
										onClick={() =>
											signIn(providers[providerKey].id, {
												callbackUrl: query.callbackUrl as string,
											})
										}
									>
										<Image
											src={require(`@/images/logos/${providerKey}.svg`)}
											width={20}
											height={20}
											alt={providers[providerKey].name}
										/>
										<span>Sign in with {providers[providerKey].name}</span>
									</Button>
								)}
							</li>
						))}
				</ul>
			</AuthLayout>
		</>
	)
}
