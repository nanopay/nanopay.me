/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		scrollRestoration: true,
		appDir: true,
		serverActions: true

	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				pathname: '/u/**',
			},
			{
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST,
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
