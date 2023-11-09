/** @type {import('next').NextConfig} */
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
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_STATIC_ASSETS_HOST,
				pathname: '/**',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/login',
				destination: '/auth/login',
			},
			{
				source: '/logout',
				destination: '/auth/logout',
			},
			{
				source: '/signup',
				destination: '/auth/signup',
			},
			{
				source: '/verify-email',
				destination: '/auth/verify-email',
			},
			{
				source: '/forgot-password',
				destination: '/auth/forgot-password',
			},
			{
				source: '/magic-link',
				destination: '/auth/magic-link',
			},
			{
				source: '/home',
				destination: '/dashboard/home',
			},
		]
	},
}

module.exports = nextConfig
