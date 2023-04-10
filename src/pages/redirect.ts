import { GetServerSidePropsContext } from 'next'

export default function Redirect() {
	return 'redirecting...'
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// we must force redirect to ensure the cookies will be saved

	const { to } = ctx.query

	if (typeof to === 'string' && to) {
		return {
			redirect: {
				destination: `/${to}`,
				permanent: false,
			},
		}
	} else {
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		}
	}
}
