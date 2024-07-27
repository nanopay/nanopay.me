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
		],
	},
	redirects: async () => [
		{
			source:
				'/:serviceIdOrSlug((?!api).*)/webhooks/:webhookId((?!new$)[a-z0-9.-]+)',
			destination: '/:serviceIdOrSlug/webhooks/:webhookId/settings',
			permanent: true,
		},
	],
}

module.exports = nextConfig
