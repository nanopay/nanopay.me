import type { Config } from 'tailwindcss'

const config = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'class',
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		fontSize: {
			xs: ['0.75rem', { lineHeight: '1rem' }],
			'2xs': ['0.625rem', { lineHeight: '1rem' }],
			'3xs': ['0.5rem', { lineHeight: '1rem' }],
			'4xs': ['0.375rem', { lineHeight: '1rem' }],
			'5xs': ['0.25rem', { lineHeight: '1rem' }],
			sm: ['0.875rem', { lineHeight: '1.5rem' }],
			base: ['1rem', { lineHeight: '1.5rem' }],
			lg: ['1.125rem', { lineHeight: '2rem' }],
			xl: ['1.25rem', { lineHeight: '1.75rem' }],
			'2xl': ['1.5rem', { lineHeight: '2rem' }],
			'3xl': ['2rem', { lineHeight: '3rem' }],
			'4xl': ['2.5rem', { lineHeight: '3rem' }],
			'5xl': ['3rem', { lineHeight: '1' }],
			'6xl': ['3.75rem', { lineHeight: '1' }],
			'7xl': ['4.5rem', { lineHeight: '1' }],
			'8xl': ['6rem', { lineHeight: '1' }],
			'9xl': ['8rem', { lineHeight: '1' }],
		},
		extend: {
			maxWidth: {
				'2xl': '40rem',
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
			colors: ({ colors }) => ({
				gray: colors.slate,
				'nano-light': '#d2ebfa',
				nano: '#209CE9',
				'nano-dark': '#4a90e2',
			}),
			keyframes: {
				'fade-in': {
					from: {
						opacity: '0',
					},
					to: {
						opacity: '1',
					},
				},
				marquee: {
					'100%': {
						transform: 'translateY(-50%)',
					},
				},
				'spin-reverse': {
					to: {
						transform: 'rotate(-360deg)',
					},
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.5s linear forwards',
				marquee: 'marquee var(--marquee-duration) linear infinite',
				'spin-slow': 'spin 4s linear infinite',
				'spin-slower': 'spin 6s linear infinite',
				'spin-reverse': 'spin-reverse 1s linear infinite',
				'spin-reverse-slow': 'spin-reverse 4s linear infinite',
				'spin-reverse-slower': 'spin-reverse 6s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
