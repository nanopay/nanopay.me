/** @type {import('next').NextConfig} */

import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

const staticAssetsUrl = new URL(process.env.NEXT_PUBLIC_STATIC_ASSETS_URL)

const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	options: {
		remarkPlugins: [remarkGfm],
		// rehypePlugins: [],
	},
})

export default withMDX(nextConfig)
