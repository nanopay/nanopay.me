/** @type {import('next').NextConfig} */

const staticAssetsUrl = new URL(process.env.NEXT_PUBLIC_STATIC_ASSETS_URL)

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				pathname: '/u/**',
			},
			{
				protocol: staticAssetsUrl.protocol.replace(':', ''),
				hostname: staticAssetsUrl.hostname,
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'avatar.vercel.sh',
				pathname: '/**',
			},
		],
	},
	redirects: async () => [
		{
			source:
				'/:serviceName((?!api).*)/webhooks/:webhookId((?!new$)[a-z0-9.-]+)',
			destination: '/:serviceName/webhooks/:webhookId/settings',
			permanent: true,
		},
	],
}

module.exports = nextConfig
