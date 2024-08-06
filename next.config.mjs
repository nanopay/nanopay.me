/** @type {import('next').NextConfig} */

import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

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
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeSlug],
	},
})

export default withMDX(nextConfig)
